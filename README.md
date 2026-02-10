# PanOS MCP Server

> **Warning:** This server gives an AI model direct access to your firewall configuration via the PanOS API. AI models can make mistakes, misinterpret instructions, or take unintended actions that may disrupt network traffic, modify security policies, or cause outages. **Use at your own risk.** Always review AI-proposed changes before committing, use a read-only API key where possible, and never run against production firewalls without understanding the consequences.

An [MCP (Model Context Protocol)](https://modelcontextprotocol.io) server for interacting with Palo Alto Networks PanOS firewalls and Panorama. Provides 100 tools across 16 modules for firewall management, monitoring, and configuration.

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

### Claude Desktop — Desktop Extension (recommended)

1. Download the latest `panos-mcp.mcpb` from [Releases](https://github.com/apius-tech/Palo-MCP/releases)
2. Double-click the file — Claude Desktop opens an install dialog
3. Enter your **Firewall Host** and **API Key** when prompted

The API key is stored securely in your OS keychain, not in plaintext config files.

### Claude Desktop — npx

Add to your `claude_desktop_config.json`:

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

Config file location: **macOS** `~/Library/Application Support/Claude/claude_desktop_config.json` · **Windows** `%APPDATA%\Claude\claude_desktop_config.json`

### Cursor

Open Cursor Settings (Ctrl+Shift+J) → MCP → Add new MCP server, or add to `~/.cursor/mcp.json`:

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

### Windsurf

Add to `~/.codeium/windsurf/mcp_config.json`:

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

### Claude Code (CLI)

```bash
claude mcp add panos -- npx -y github:apius-tech/Palo-MCP \
  --env PANOS_HOST=your-firewall-or-panorama \
  --env PANOS_API_KEY=your-api-key
```

Replace `your-firewall-or-panorama` with your firewall/Panorama IP or hostname, and `your-api-key` with your PanOS API key.

## Tool Categories

| Category | Tools | Description |
|----------|-------|-------------|
| System | 4 | Firewall info, HA status, sessions, resources |
| Network | 7 | Interfaces, zones, routing, ARP, VLANs, DHCP, DNS proxy |
| Security | 14 | Security rules CRUD, profiles, profile groups, PBF rules CRUD, DoS, QoS rules CRUD |
| Objects | 13 | Address/service objects and groups (get, add, delete), application filters |
| NAT | 5 | NAT rules (get, add, move, delete, enable/disable) |
| User-ID | 3 | User-IP mappings, groups, config |
| Admin | 3 | Admins, roles, auth profiles |
| VPN | 3 | IPSec tunnels, GlobalProtect users and config |
| Panorama | 20 | Device groups, templates, shared objects, pre/post rules, push status, HA |
| Logs | 4 | Traffic, threat, system, and config logs |
| Threat | 4 | WildFire, antivirus, content versions, URL categories |
| Certificates | 7 | Certificates, decryption rules (get, add, move, delete, enable/disable) and profiles |
| Licenses | 2 | License info and usage |
| Config | 4 | Set/delete config, commit, Panorama push |
| Utility | 2 | Arbitrary op commands, XPath config reads |
| Firewalls | 1 | List configured firewall targets |

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

## Examples

**"Show me the firewall system info"**

Uses `get_firewall_info` to retrieve hostname, model, serial number, and software version.

**"List all security rules on the firewall"**

Uses `get_security_rules` to retrieve the full security policy rulebase.

**"Create an address object for the 10.0.1.0/24 subnet called lab-network, then commit"**

Uses `set_config` to create the address object in the candidate configuration, then `commit` to activate the change on the running firewall.

## Privacy

- **No data collection** — This extension does not collect, store, or transmit any data to third parties.
- **Direct communication only** — All API calls go directly from your machine to your PanOS firewall or Panorama. No traffic is routed through intermediary servers.
- **Local credential storage** — API keys are stored in your OS keychain (Desktop Extension) or in local environment variables. They are never sent anywhere other than your firewall.
- **No telemetry or analytics** — This extension contains no tracking, telemetry, or analytics of any kind.

## Disclaimer

This software is provided "as is", without warranty of any kind. This tool connects an AI model to live network infrastructure. AI models can hallucinate, misunderstand context, and execute unintended changes. The authors are not responsible for any damage, data loss, outages, or security incidents caused by the use of this software. You are solely responsible for any actions taken by the AI model through this server.

**Recommendations:**
- Test in a lab environment before using in production
- Use a read-only API key for inspection tasks
- Always review and confirm changes before committing
- Monitor firewall logs for unexpected configuration changes

## License

ISC
