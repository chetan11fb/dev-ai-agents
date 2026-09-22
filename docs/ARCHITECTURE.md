# DEV-AI Architecture

GitHub is authoritative. The website reads the registry and component files from this repository.

### Component contract
Each component has a stable ID, type, source path, target path and version. The website should generate installation UI from this metadata rather than duplicating component definitions.

### Installer contract
Resolve component ID -> source path -> target path. Create missing directories. Refuse silent overwrite. Download only from the canonical repository. Do not execute downloaded content.

### Security
Never commit API keys, tokens or credentials. Installers have no telemetry by default.

### Extension points
`mcp/`, `commands/`, `hooks/` and `plugins/` are reserved for tested integrations.
