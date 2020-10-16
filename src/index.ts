import { spawn, ChildProcess } from 'child_process'

export interface TsLubeOptions {
  debounce?: number
  yarn?: boolean
  verbose?: boolean
}

function debounceFunction(cmd: () => void, interval: number): () => void {
  let timeout: NodeJS.Timeout | undefined

  return (): void => {
    if (timeout !== undefined) {
      clearTimeout(timeout)
      timeout = undefined
    }

    setTimeout(() => {
      timeout = undefined
      cmd()
    }, interval)
  }
}

export async function tsLube(
  spawnArgs: string[],
  { debounce = 300, yarn = false, verbose = false }: TsLubeOptions,
): Promise<void> {
  let proc: ChildProcess | undefined

  const tsc = spawn(yarn ? 'yarn' : 'npx', ['tsc', '--incremental', '--watch'], {
    stdio: ['ignore', 'pipe', 'pipe'],
  })

  const onProcessExit = (): void => {
    console.warn('process exited unexpectedly')
    proc = undefined
  }

  const spawnProcess = (): void => {
    proc = spawn('node', spawnArgs, { stdio: 'inherit' })

    proc.on('exit', onProcessExit)
  }

  const restartProcess = debounceFunction(() => {
    if (proc) {
      proc.off('exit', onProcessExit)

      proc.on('exit', () => {
        proc = undefined
        if (verbose) {
          console.log('process exited')
        }
        spawnProcess()
      })
      proc.kill()
    } else {
      spawnProcess()
    }
  }, debounce)

  tsc.stdout.on('data', (lineBuffer: Buffer) => {
    const line = lineBuffer.toString()
    if (verbose) {
      console.log('tsc:', line.trim())
    }

    if (line.includes('Found 0 errors.')) {
      if (!proc) {
        if (verbose) {
          console.log(`starting process`)
        }
        spawnProcess()
      } else {
        if (verbose) {
          console.log(`restarting process`)
        }
        restartProcess()
      }
    }
  })

  tsc.stderr.on('data', (line) => {
    console.warn('tsc:', line.toString().trim())
  })
}
