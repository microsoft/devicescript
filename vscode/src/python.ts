import * as vscode from "vscode"
// https://raw.githubusercontent.com/microsoft/vscode-python/main/src/client/apiTypes.ts
import { CancellationToken, Event, Uri, WorkspaceFolder } from "vscode"

/*
 * Do not introduce any breaking changes to this API.
 * This is the public API for other extensions to interact with this extension.
 */

export interface IExtensionApi {
    /**
     * These APIs provide a way for extensions to work with by python environments available in the user's machine
     * as found by the Python extension. See
     * https://github.com/microsoft/vscode-python/wiki/Python-Environment-APIs for usage examples and more.
     */
    readonly environments: {
        /**
         * Returns the environment configured by user in settings. Note that this can be an invalid environment, use
         * {@link resolveEnvironment} to get full details.
         * @param resource : Uri of a file or workspace folder. This is used to determine the env in a multi-root
         * scenario. If `undefined`, then the API returns what ever is set for the workspace.
         */
        getActiveEnvironmentPath(resource?: Resource): EnvironmentPath
        /**
         * Sets the active environment path for the python extension for the resource. Configuration target will always
         * be the workspace folder.
         * @param environment : If string, it represents the full path to environment folder or python executable
         * for the environment. Otherwise it can be {@link Environment} or {@link EnvironmentPath} itself.
         * @param resource : [optional] File or workspace to scope to a particular workspace folder.
         */
        updateActiveEnvironmentPath(
            environment: string | EnvironmentPath | Environment,
            resource?: Resource
        ): Promise<void>
        /**
         * This event is triggered when the active environment setting changes.
         */
        readonly onDidChangeActiveEnvironmentPath: Event<ActiveEnvironmentPathChangeEvent>
        /**
         * Carries environments known to the extension at the time of fetching the property. Note this may not
         * contain all environments in the system as a refresh might be going on.
         *
         * Only reports environments in the current workspace.
         */
        readonly known: readonly Environment[]
        /**
         * This event is triggered when the known environment list changes, like when a environment
         * is found, existing environment is removed, or some details changed on an environment.
         */
        readonly onDidChangeEnvironments: Event<EnvironmentsChangeEvent>
        /**
         * This API will trigger environment discovery, but only if it has not already happened in this VSCode session.
         * Useful for making sure env list is up-to-date when the caller needs it for the first time.
         *
         * To force trigger a refresh regardless of whether a refresh was already triggered, see option
         * {@link RefreshOptions.forceRefresh}.
         *
         * Note that if there is a refresh already going on then this returns the promise for that refresh.
         * @param options Additional options for refresh.
         * @param token A cancellation token that indicates a refresh is no longer needed.
         */
        refreshEnvironments(
            options?: RefreshOptions,
            token?: CancellationToken
        ): Promise<void>
        /**
         * Returns details for the given environment, or `undefined` if the env is invalid.
         * @param environment : If string, it represents the full path to environment folder or python executable
         * for the environment. Otherwise it can be {@link Environment} or {@link EnvironmentPath} itself.
         */
        resolveEnvironment(
            environment: Environment | EnvironmentPath | string
        ): Promise<ResolvedEnvironment | undefined>
        /**
         * Returns the environment variables used by the extension for a resource, which includes the custom
         * variables configured by user in `.env` files.
         * @param resource : Uri of a file or workspace folder. This is used to determine the env in a multi-root
         * scenario. If `undefined`, then the API returns what ever is set for the workspace.
         */
        getEnvironmentVariables(resource?: Resource): EnvironmentVariables
        /**
         * This event is fired when the environment variables for a resource change. Note it's currently not
         * possible to detect if environment variables in the system change, so this only fires if custom
         * environment variables are updated in `.env` files.
         */
        readonly onDidEnvironmentVariablesChange: Event<EnvironmentVariablesChangeEvent>
    }
}

export type RefreshOptions = {
    /**
     * When `true`, force trigger a refresh regardless of whether a refresh was already triggered. Note this can be expensive so
     * it's best to only use it if user manually triggers a refresh.
     */
    forceRefresh?: boolean
}

/**
 * Details about the environment. Note the environment folder, type and name never changes over time.
 */
export type Environment = EnvironmentPath & {
    /**
     * Carries details about python executable.
     */
    readonly executable: {
        /**
         * Uri of the python interpreter/executable. Carries `undefined` in case an executable does not belong to
         * the environment.
         */
        readonly uri: Uri | undefined
        /**
         * Bitness if known at this moment.
         */
        readonly bitness: Bitness | undefined
        /**
         * Value of `sys.prefix` in sys module if known at this moment.
         */
        readonly sysPrefix: string | undefined
    }
    /**
     * Carries details if it is an environment, otherwise `undefined` in case of global interpreters and others.
     */
    readonly environment:
        | {
              /**
               * Type of the environment.
               */
              readonly type: EnvironmentType
              /**
               * Name to the environment if any.
               */
              readonly name: string | undefined
              /**
               * Uri of the environment folder.
               */
              readonly folderUri: Uri
              /**
               * Any specific workspace folder this environment is created for.
               */
              readonly workspaceFolder: WorkspaceFolder | undefined
          }
        | undefined
    /**
     * Carries Python version information known at this moment, carries `undefined` for envs without python.
     */
    readonly version:
        | (VersionInfo & {
              /**
               * Value of `sys.version` in sys module if known at this moment.
               */
              readonly sysVersion: string | undefined
          })
        | undefined
    /**
     * Tools/plugins which created the environment or where it came from. First value in array corresponds
     * to the primary tool which manages the environment, which never changes over time.
     *
     * Array is empty if no tool is responsible for creating/managing the environment. Usually the case for
     * global interpreters.
     */
    readonly tools: readonly EnvironmentTools[]
}

/**
 * Derived form of {@link Environment} where certain properties can no longer be `undefined`. Meant to represent an
 * {@link Environment} with complete information.
 */
export type ResolvedEnvironment = Environment & {
    /**
     * Carries complete details about python executable.
     */
    readonly executable: {
        /**
         * Uri of the python interpreter/executable. Carries `undefined` in case an executable does not belong to
         * the environment.
         */
        readonly uri: Uri | undefined
        /**
         * Bitness of the environment.
         */
        readonly bitness: Bitness
        /**
         * Value of `sys.prefix` in sys module.
         */
        readonly sysPrefix: string
    }
    /**
     * Carries complete Python version information, carries `undefined` for envs without python.
     */
    readonly version:
        | (ResolvedVersionInfo & {
              /**
               * Value of `sys.version` in sys module if known at this moment.
               */
              readonly sysVersion: string
          })
        | undefined
}

export type EnvironmentsChangeEvent = {
    readonly env: Environment
    /**
     * * "add": New environment is added.
     * * "remove": Existing environment in the list is removed.
     * * "update": New information found about existing environment.
     */
    readonly type: "add" | "remove" | "update"
}

export type ActiveEnvironmentPathChangeEvent = EnvironmentPath & {
    /**
     * Workspace folder the environment changed for.
     */
    readonly resource: WorkspaceFolder | undefined
}

/**
 * Uri of a file inside a workspace or workspace folder itself.
 */
export type Resource = Uri | WorkspaceFolder

export type EnvironmentPath = {
    /**
     * The ID of the environment.
     */
    readonly id: string
    /**
     * Path to environment folder or path to python executable that uniquely identifies an environment. Environments
     * lacking a python executable are identified by environment folder paths, whereas other envs can be identified
     * using python executable path.
     */
    readonly path: string
}

/**
 * Tool/plugin where the environment came from. It can be {@link KnownEnvironmentTools} or custom string which
 * was contributed.
 */
export type EnvironmentTools = KnownEnvironmentTools | string
/**
 * Tools or plugins the Python extension currently has built-in support for. Note this list is expected to shrink
 * once tools have their own separate extensions.
 */
export type KnownEnvironmentTools =
    | "Conda"
    | "Pipenv"
    | "Poetry"
    | "VirtualEnv"
    | "Venv"
    | "VirtualEnvWrapper"
    | "Pyenv"
    | "Unknown"

/**
 * Type of the environment. It can be {@link KnownEnvironmentTypes} or custom string which was contributed.
 */
export type EnvironmentType = KnownEnvironmentTypes | string
/**
 * Environment types the Python extension is aware of. Note this list is expected to shrink once tools have their
 * own separate extensions, in which case they're expected to provide the type themselves.
 */
export type KnownEnvironmentTypes = "VirtualEnvironment" | "Conda" | "Unknown"

/**
 * Carries bitness for an environment.
 */
export type Bitness = "64-bit" | "32-bit" | "Unknown"

/**
 * The possible Python release levels.
 */
export type PythonReleaseLevel = "alpha" | "beta" | "candidate" | "final"

/**
 * Release information for a Python version.
 */
export type PythonVersionRelease = {
    readonly level: PythonReleaseLevel
    readonly serial: number
}

export type VersionInfo = {
    readonly major: number | undefined
    readonly minor: number | undefined
    readonly micro: number | undefined
    readonly release: PythonVersionRelease | undefined
}

export type ResolvedVersionInfo = {
    readonly major: number
    readonly minor: number
    readonly micro: number
    readonly release: PythonVersionRelease
}

/**
 * A record containing readonly keys.
 */
export type EnvironmentVariables = {
    readonly [key: string]: string | undefined
}

export type EnvironmentVariablesChangeEvent = {
    /**
     * Workspace folder the environment variables changed for.
     */
    readonly resource: WorkspaceFolder | undefined
    /**
     * Updated value of environment variables.
     */
    readonly env: EnvironmentVariables
}

async function resolvePythonApi() {
    const py = vscode.extensions.getExtension("ms-python.python")
    if (!py) return undefined

    if (!py.isActive) await py.activate()

    const pythonApi = py.exports as IExtensionApi
    return pythonApi
}

export async function resolvePythonEnvironment() {
    const pythonApi = await resolvePythonApi()
    if (!pythonApi) return undefined

    const environmentPath = pythonApi.environments.getActiveEnvironmentPath()
    const environment = await pythonApi.environments.resolveEnvironment(
        environmentPath
    )
    if (!environment) return undefined

    return environment
}
