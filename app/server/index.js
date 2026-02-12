var express = require('express')
var app     = require('express')()
var server  = require('http').Server(app)
var path    = require('path')
var spawn   = require('child_process').spawn
var fs      = require('fs')
var ws      = require('websocket').server
var args    = require('yargs').argv
var host    = args.host || process.env.ARCHIVE_DASH_SERVER_HOST || '0.0.0.0'
var port    = args.port || process.env.ARCHIVE_DASH_SERVER_PORT || 80

server.listen(port, host, function() {
  console.log('The Archive Dashboard Server Started on ' + host + ':' + port + '!');
})

app.use(express.static(path.resolve(__dirname + '/../')))

app.get('/', function (req, res) {
	res.sendFile(path.resolve(__dirname + '/../index.html'))
})

app.get('/websocket', function (req, res) {

  res.send({
    websocket_support: true,
  })

})

wsServer = new ws({
	httpServer: server
})

var nixJsonAPIScript = path.resolve(__dirname, 'linux_json_api.sh')

function getPluginData(pluginName, callback) {
  var output = []

  // Candidates to try for running the POSIX shell script. On Linux/macOS
  // we prefer `bash`. On Windows try `bash` (Git Bash / WSL) then `sh`.
  var shellCandidates = []
  if (process.platform === 'win32') {
    shellCandidates = ['bash', 'sh']
  } else {
    shellCandidates = ['bash', 'sh']
  }

  // Also allow invoking the script directly (may work if executable/shebang present)
  var directCandidate = nixJsonAPIScript

  // Try shells sequentially until one starts successfully.
  var tried = 0
  function tryNextShell() {
    if (tried < shellCandidates.length) {
      var shell = shellCandidates[tried++]
      var cmd = spawn(shell, [nixJsonAPIScript, pluginName, ''])

      cmd.stdout.on('data', function(chunk) { output.push(chunk.toString()) })
      cmd.stderr.on('data', function(chunk) { output.push(chunk.toString()) })

      var errored = false
      cmd.on('error', function(err) {
        errored = true
        // try the next shell candidate
        tryNextShell()
      })

      cmd.on('close', function(code) {
        if (!errored) callback(code, output)
      })

    } else {
      // Last resort: try to spawn the script file directly. This works on Unix
      // when the script is executable and has a shebang.
      try {
        var cmd2 = spawn(directCandidate, [pluginName, ''])

        cmd2.stdout.on('data', function(chunk) { output.push(chunk.toString()) })
        cmd2.stderr.on('data', function(chunk) { output.push(chunk.toString()) })

        cmd2.on('error', function(err) {
          // give a friendly message instead of crashing the process
          var msg = 'Failed to execute plugin script: ' + (err && err.message ? err.message : String(err))
          callback(127, [msg])
        })

        cmd2.on('close', function(code) {
          callback(code, output)
        })
      } catch (ex) {
        var msg = 'Failed to execute plugin script: ' + (ex && ex.message ? ex.message : String(ex))
        callback(127, [msg])
      }
    }
  }

  tryNextShell()
}

wsServer.on('request', function(request) {

	var wsClient = request.accept('', request.origin)

  wsClient.on('message', function(wsReq) {

    var moduleName = wsReq.utf8Data
    var sendDataToClient = function(code, output) {
      if (code === 0) {
        var wsResponse = '{ "moduleName": "' + moduleName + '", "output": "'+ output.join('') +'" }'
        wsClient.sendUTF(wsResponse)
      }
    }

    getPluginData(moduleName, sendDataToClient)

  })

})

app.get('/server/', function (req, res) {

	var respondWithData = function(code, output) {
		if (code === 0) res.send(output.toString())
		else res.sendStatus(500)
	}

  getPluginData(req.query.module, respondWithData)
})
