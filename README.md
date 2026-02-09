# PanOS MCP Server

An [MCP (Model Context Protocol)](https://modelcontextprotocol.io) server for interacting with Palo Alto Networks PanOS firewalls and Panorama. Provides 70+ tools across 15 modules for firewall management, monitoring, and configuration.

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

## Quick Start

### Option A: Desktop Extension (recommended)

1. Download the latest `panos-mcp.mcpb` from [Releases](https://github.com/apius-tech/Palo-MCP/releases)
2. Double-click the file — Claude Desktop opens an install dialog
3. Enter your **Firewall Host** and **API Key** when prompted

The API key is stored securely in your OS keychain, not in plaintext config files.

### Option B: npx

No installation needed — run directly from GitHub with `npx`.

Open your Claude Desktop MCP configuration file:

```bash
# macOS
open "$HOME/Library/Application Support/Claude/claude_desktop_config.json"

# Windows
notepad "%APPDATA%\Claude\claude_desktop_config.json"
```

Add the `panos` server entry:

```json
{
  "mcpServers": {
    "panos": {
      "command": "npx",
      "args": ["-y", "github:apius-tech/Palo-MCP"],
      "env": {
        "PANOS_HOST": "your-firewall-or-panorama",
        "PANOS_API_KEY": "your-api-key"
      }
    }
  }
}
```

Replace `your-firewall-or-panorama` with your firewall/Panorama IP or hostname, and `your-api-key` with your PanOS API key.

Restart Claude Desktop — the PanOS tools will be available immediately.

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
| Utility | 3 | Arbitrary op commands, XPath config reads, list firewalls |

## Safety Labels

Every tool is labeled to indicate its impact:

- **`[READ-ONLY]`** — Only reads data; no changes to the firewall
- **`[MODIFIES CONFIG]`** — Stages or commits configuration changes that affect live traffic
- **`[ADVANCED]`** — Accepts arbitrary commands; impact depends on the input

## API Key

Generate a PanOS API key from the firewall web UI or CLI:

**Web UI:** Device → Administrators → your admin user → Generate API Key

**CLI:**
```bash
curl -k 'https://YOUR-FIREWALL/api/?type=keygen&user=admin&password=YOUR-PASSWORD'
```

See [PanOS documentation](https://docs.paloaltonetworks.com/pan-os/11-1/pan-os-panorama-api/get-started-with-the-pan-os-xml-api/get-your-api-key) for details.

## Development

```bash
git clone https://github.com/apius-tech/Palo-MCP.git
cd Palo-MCP
npm install
cp .env.example .env   # fill in PANOS_HOST and PANOS_API_KEY
```

```bash
npm run build           # compile TypeScript
npm run dev             # watch mode (rebuild on changes)
npm test                # run tests
npm run start           # run the server
npm run pack:extension  # build Desktop Extension (.mcpb)
```

## License

ISC
