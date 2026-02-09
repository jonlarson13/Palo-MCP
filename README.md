# PanOS MCP Server

An [MCP (Model Context Protocol)](https://modelcontextprotocol.io) server for interacting with Palo Alto Networks PanOS firewalls and Panorama. Provides 51 tools across 15 modules for firewall management, monitoring, and configuration.

## Features

- **Read-only inspection** of firewall state, policies, objects, logs, and more
- **Configuration management** via XPath-based set/delete with staged commits
- **Panorama support** for centralized management of device groups, templates, and shared objects
- **Input validation** with Zod schemas for early error detection
- **Safety labels** on every tool: `[READ-ONLY]`, `[MODIFIES CONFIG]`, or `[ADVANCED]`

## Prerequisites

- Node.js 18+
- A PanOS firewall or Panorama appliance with API access enabled
- A PanOS API key ([how to generate](https://docs.paloaltonetworks.com/pan-os/11-1/pan-os-panorama-api/get-started-with-the-pan-os-xml-api/get-your-api-key))

## Installation

```bash
npm install
npm run build
```

## Configuration

Copy the example environment file and fill in your values:

```bash
cp .env.example .env
```

| Variable | Description |
|----------|-------------|
| `PANOS_HOST` | Firewall or Panorama hostname/IP |
| `PANOS_API_KEY` | API key for authentication |

## Usage with Claude Desktop

Add to your Claude Desktop MCP configuration (`claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "panos": {
      "command": "node",
      "args": ["/path/to/panos-mcp/dist/index.js"],
      "env": {
        "PANOS_HOST": "your-firewall-or-panorama",
        "PANOS_API_KEY": "your-api-key"
      }
    }
  }
}
```

## Tool Categories

| Category | Tools | Description |
|----------|-------|-------------|
| System | 4 | Firewall info, HA status, sessions, resources |
| Network | 7 | Interfaces, zones, routing, ARP, VLANs, DHCP, DNS proxy |
| Security | 6 | Security rules, profiles, profile groups, PBF, DoS, QoS |
| Objects | 5 | Address/service objects and groups, application filters |
| NAT | 1 | NAT rules |
| User-ID | 3 | User-IP mappings, groups, config |
| Admin | 3 | Admins, roles, auth profiles |
| VPN | 3 | IPSec tunnels, GlobalProtect users and config |
| Panorama | 20 | Device groups, templates, shared objects, pre/post rules, push status, HA |
| Logs | 4 | Traffic, threat, system, and config logs |
| Threat | 4 | WildFire, antivirus, content versions, URL categories |
| Certificates | 3 | Certificates, decryption rules and profiles |
| Licenses | 2 | License info and usage |
| Config | 4 | Set/delete config, commit, Panorama push |
| Utility | 2 | Arbitrary op commands, XPath config reads |

## Safety Labels

Every tool is labeled to indicate its impact:

- **`[READ-ONLY]`** — Only reads data; no changes to the firewall
- **`[MODIFIES CONFIG]`** — Stages or commits configuration changes that affect live traffic
- **`[ADVANCED]`** — Accepts arbitrary commands; impact depends on the input

## Development

```bash
# Watch mode (rebuild on changes)
npm run dev

# Build
npm run build

# Run tests
npm test

# Run the server
npm run start
```

## License

ISC
