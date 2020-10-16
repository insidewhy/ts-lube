import { tsLube, TsLubeOptions } from '.'

async function doMain(): Promise<void> {
  const args = process.argv
  const opts: TsLubeOptions = {}

  let i = 2
  for (; i < args.length; ++i) {
    const arg = args[i]
    if (arg === '-d' || arg === '--debounce') {
      opts.debounce = parseInt(args[++i])
    } else if (arg === '-y' || arg === '--yarn') {
      opts.yarn = true
    } else if (arg === '-v' || arg === '--verbose') {
      opts.verbose = true
    } else {
      break
    }
  }
  const spawnArgs = args.slice(i)

  await tsLube(spawnArgs, opts)
}

export async function main(): Promise<void> {
  try {
    // await to ensure exceptions are propagated
    await doMain()
  } catch (e) {
    console.error(typeof e === 'string' ? e : e.message)
    process.exit(1)
  }
}
