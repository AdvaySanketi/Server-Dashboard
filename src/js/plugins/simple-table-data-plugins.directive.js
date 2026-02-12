var simpleTableModules = [
  {
    name: 'machineInfo',
    template: '<key-value-list heading="General Info." module-name="general_info" info="System Information"></key-value-list>'
  },
  {
    name: 'ipAddresses',
    template: '<table-data heading="IP Addresses" module-name="ip_addresses" info="IPs assigned to this server"></table-data>'
  },
  {
    name: 'ramIntensiveProcesses',
    template: '<table-data heading="RAM Processes" module-name="ram_intensive_processes" info="Processes which are using most RAM." enlarged="{{ enlarged }}"></table-data>'
  },
  {
    name: 'cpuIntensiveProcesses',
    template: '<table-data heading="CPU Processes" module-name="cpu_intensive_processes" info="Processes which are using most CPU." enlarged="{{ enlarged }}"></table-data>'
  },
  {
    name: 'dockerProcesses',
    template: '<table-data heading="Docker Processes" module-name="docker_processes" info="Processes in Docker Containers sorted by CPU." enlarged="{{ enlarged }}"></table-data>'
  },
  {
    name: 'networkConnections',
    template: '<table-data heading="Network Connections" module-name="network_connections"></table-data>'
  },
  {
    name: 'serverAccounts',
    template: '<table-data heading="Accounts" module-name="user_accounts" info="User accounts on this server."></table-data>'
  },
  {
    name: 'loggedInAccounts',
    template: '<table-data heading="Logged In Accounts" module-name="logged_in_users" info="Users currently logged in."></table-data>'
  },
  {
    name: 'sshSessions',
    template: '<table-data heading="SSH Sessions" module-name="ssh_sessions" info="Active SSH sessions."></table-data>'
  },
  {
    name: 'arpCacheTable',
    template: '<table-data heading="ARP Cache Table" module-name="arp_cache"></table-data>'
  },
  {
    name: 'commonApplications',
    template: '<table-data heading="Common Applications" module-name="common_applications" info="List of commonly installed applications."></table-data>'
  },
  {
    name: 'pingSpeeds',
    template: '<table-data heading="Ping Speeds" module-name="ping" info="Ping speed in milliseconds."></table-data>'
  },
  {
    name: 'bandwidth',
    template: '<table-data heading="Bandwidth" module-name="bandwidth"></table-data>'
  },
  {
    name: 'swapUsage',
    template: '<table-data heading="Swap Usage" module-name="swap"></table-data>'
  },
  {
    name: 'internetSpeed',
    template: '<key-value-list heading="Internet Speed" module-name="internet_speed" info="Internet connection speed of server."></key-value-list>'
  },
  {
    name: 'memcached',
    template: '<key-value-list heading="Memcached" module-name="memcached"></key-value-list>'
  },
  {
    name: 'redis',
    template: '<key-value-list heading="Redis" module-name="redis"></key-value-list>'
  },
  {
    name: 'pm2',
    template: '<table-data heading="PM2" module-name="pm2_stats" info="Process Manager 2 (PM2) Node Module stats"></table-data>'
  },
  {
    name: 'memoryInfo',
    template: '<key-value-list heading="Memory Info" module-name="memory_info" info="/proc/meminfo read-out."></key-value-list>'
  },
  {
    name: 'cpuInfo',
    template: '<key-value-list heading="CPU Info" module-name="cpu_info" info="/usr/bin/lscpu read-out."></key-value-list>'
  },
  {
    name: 'ioStats',
    template: '<table-data heading="IO Stats" module-name="io_stats" info="/proc/diskstats read-out."></table-data>'
  },
  {
    name: 'scheduledCrons',
    template: '<table-data heading="Scheduled Cron Jobs" module-name="scheduled_crons" info="Crons for all users on the server."></table-data>'
  },
  {
    name: 'cronHistory',
    template: '<table-data heading="Cron Job History" module-name="cron_history" info="Crons which have run recently."></table-data>'
  },
  {
    name: 'piholeStats',
    template: '<table-data heading="Pi-hole Stats" module-name="pihole_stats" info="Pi-hole DNS statistics and blocking info." link-url="http://the-archive:8888/admin"></table-data>'
  },
  {
    name: 'tailscaleStats',
    template: '<table-data heading="Tailscale Stats" module-name="tailscale_stats" info="Tailscale VPN network status." link-url="https://login.tailscale.com/admin/machines"></table-data>'
  },
  {
    name: 'caddyStats',
    template: '<table-data heading="Caddy Stats" module-name="caddy_stats" info="Caddy web server metrics."></table-data>'
  },
  {
    name: 'lidarrStats',
    template: '<table-data heading="Lidarr Stats" module-name="lidarr_stats" info="Lidarr music management statistics." link-url="http://the-archive:8686"></table-data>'
  },
  {
    name: 'navidromeStats',
    template: '<table-data heading="Navidrome Stats" module-name="navidrome_stats" info="Navidrome music server statistics." link-url="http://the-archive:4533"></table-data>'
  },
  {
    name: 'beetsStats',
    template: '<table-data heading="Beets Stats" module-name="beets_stats" info="Beets music library statistics."></table-data>'
  },
  {
    name: 'qbittorrentStats',
    template: '<table-data heading="qBittorrent Stats" module-name="qbittorrent_stats" info="qBittorrent torrent client statistics." link-url="http://the-archive:8089"></table-data>'
  }
]

simpleTableModules.forEach(function(module, key) {

  angular.module('archiveDashboard').directive(module.name, ['server', function(server) {

    var moduleDirective = {
      restrict: 'E',
      scope: {
        enlarged: '@'
      }
    }

    moduleDirective['template'] = module.template

    return moduleDirective
  }])

})
