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

## Quick Start

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
| Utility | 2 | Arbitrary op commands, XPath config reads |

## Safety Labels

Every tool is labeled to indicate its impact:

- **`[READ-ONLY]`** — Only reads data; no changes to the firewall
- **`[MODIFIES CONFIG]`** — Stages or commits configuration changes that affect live traffic
- **`[ADVANCED]`** — Accepts arbitrary commands; impact depends on the input

## Multi-Firewall Support

By default the server connects to a single firewall using `PANOS_HOST` and `PANOS_API_KEY` environment variables. To manage multiple firewalls from a single MCP server instance, create a `firewalls.json` file:

```bash
cp firewalls.json.example firewalls.json
```

```json
{
  "firewalls": [
    { "name": "hq-fw01",     "host": "10.0.1.1", "api_key": "LUFRPT..." },
    { "name": "branch-fw01", "host": "10.0.2.1", "api_key": "LUFRPT..." }
  ]
}
```

The config file path can be customized via the `PANOS_FIREWALLS_CONFIG` environment variable.

### Resolution logic

| Config state | `firewall` param | Behavior |
|---|---|---|
| No `firewalls.json` | omitted | Falls back to `PANOS_HOST`/`PANOS_API_KEY` env vars |
| Single entry | omitted | Uses that entry automatically |
| Multiple entries | omitted | **Error** — param is required |
| Any | provided | Looks up by name |

Use the `list_firewalls` tool to see configured targets and whether the `firewall` parameter is required.

## API Key Generation

Two ways to generate a PanOS API key:

### CLI (for quick setup)

```bash
# Generate and print the key
npm run keygen -- --host 10.0.1.1 --user admin

# Generate, print, and save to firewalls.json
npm run keygen -- --host 10.0.1.1 --user admin --name hq-fw01
```

The CLI prompts for the password interactively (masked with `*`). The API key is printed to stdout; status messages go to stderr, so you can pipe the key:

```bash
KEY=$(npm run keygen -- --host 10.0.1.1 --user admin 2>/dev/null)
```

### MCP Tool (from Claude)

Use the `generate_api_key` tool:

- **host** (required) — firewall hostname or IP
- **username** (required) — PanOS admin username
- **password** (required) — PanOS admin password
- **save_name** (optional) — if provided, saves the entry to `firewalls.json`

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
```

## License

ISC
