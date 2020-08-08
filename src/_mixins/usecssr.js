const mountedStyleMap = new Map()

if (process.env.NODE_ENV !== 'production') {
  if (!window.naive) window.naive = {}
  window.naive.styleRenderingDuration = 0
}

function isStyleMounted (id) {
  return mountedStyleMap.has(id)
}

function markStyleMounted (id) {
  return mountedStyleMap.set(id, 1)
}

function getThemeVariables (naive, themeName) {
  const styles = naive.styles
  const theme = styles[themeName]
  return theme.base
}

function createMutableStyleId (
  componentCssrId,
  renderedTheme,
  dependencyKey,
  dependencyValue
) {
  if (
    dependencyKey === 'syntheticTheme' ||
    dependencyKey === 'theme'
  ) {
    return componentCssrId + '-' + renderedTheme
  }
  return (
    componentCssrId + '-' +
    renderedTheme + '-' +
    dependencyKey + (dependencyValue ? ('-' + dependencyValue) : '')
  )
}

function createImmutableStyleId (
  componentName
) {
  return componentName
}

function setupMutableStyle (
  instance,
  theme,
  dependencyKey,
  CNode
) {
  const naive = instance.$naive
  const options = instance.$options
  const {
    fallbackTheme,
    styles
  } = naive
  const name = options.cssrName || options.name
  const id = options.cssrId || name
  const renderedTheme = theme || fallbackTheme
  const dependencyValue = dependencyKey === 'syntheticTheme' ? renderedTheme : instance[dependencyKey]
  if (
    process.env.NODE_ENV !== 'production' &&
    (dependencyValue === null || dependencyValue === undefined)
  ) {
    console.error(`[naive-ui/mixins/usecssr]: dependency key ${name}.${dependencyKey} should be nullable`)
  }
  const mountId = createMutableStyleId(
    id,
    renderedTheme,
    dependencyKey,
    dependencyValue
  )
  if (isStyleMounted(mountId)) return
  const cssrPropsGetter = styles[renderedTheme][name]
  if (process.env.NODE_ENV !== 'production' && !cssrPropsGetter) {
    console.error(`[naive-ui/mixins/usecssr]: ${name}'s style not found`, styles)
  }
  // themeVariables: { base, derived }
  const themeVariables = getThemeVariables(naive, renderedTheme)
  const componentCssrProps = {
    $instance: instance,
    $base: themeVariables.base,
    $derived: themeVariables.derived,
    $local: cssrPropsGetter.cssrProps(themeVariables),
    $renderedTheme: renderedTheme,
    $fallbackTheme: fallbackTheme
  }
  CNode.mount({
    target: mountId,
    props: componentCssrProps,
    count: false
  })
  markStyleMounted(mountId)
}

function setupImmutableStyle (
  instance,
  CNode
) {
  const options = instance.$options
  const mountId = createImmutableStyleId(
    options.cssrId || options.cssrName || options.name
  )
  if (isStyleMounted(mountId)) return
  CNode.mount({
    target: mountId,
    props: {
      $instance: instance
    },
    count: false
  })
  markStyleMounted(mountId)
}

function setupCssrProps (
  instance,
  theme
) {
  const naive = instance.$naive
  const options = instance.$options
  const {
    fallbackTheme,
    styles
  } = naive
  const name = options.cssrName || options.name
  const renderedTheme = theme || fallbackTheme
  const cssrPropsGetter = styles[renderedTheme][name]
  const themeVariables = getThemeVariables(naive, renderedTheme)
  const componentCssrProps = {
    $instance: instance,
    $base: themeVariables.base,
    $derived: themeVariables.derived,
    $local: cssrPropsGetter.cssrProps(themeVariables),
    $renderedTheme: renderedTheme,
    $fallbackTheme: fallbackTheme
  }
  instance.cssrProps = componentCssrProps
}

export default function (styles, cssrPropsOption) {
  // collect watchers
  const watchers = {}
  if (
    cssrPropsOption &&
    cssrPropsOption.themeKey &&
    cssrPropsOption.injectCssrProps
  ) {
    const themeKey = cssrPropsOption.themeKey
    watchers[themeKey] = [
      instance => {
        setupCssrProps(instance, instance[themeKey])
      }
    ]
  }
  styles.forEach(style => {
    if (!style.watch) return
    style.watch.forEach(watchKey => {
      if (!watchers[watchKey]) watchers[watchKey] = []
      watchers[watchKey].push(
        function (instance, syntheticTheme) {
          if (process.env.NODE_ENV !== 'production') {
            window.naive.styleRenderingDuration -= performance.now()
          }
          setupMutableStyle(
            instance,
            syntheticTheme || null,
            style.key,
            style.CNode
          )
          if (process.env.NODE_ENV !== 'production') {
            window.naive.styleRenderingDuration += performance.now()
          }
        }
      )
    })
  })
  // create component watch options
  const watch = {}
  Object
    .keys(watchers)
    .forEach(
      watchKey => {
        watch[watchKey] = function () {
          // TODO use `themeKey`
          const syntheticTheme = this.syntheticTheme || this.theme
          watchers[watchKey].forEach(watcher => {
            watcher(this, syntheticTheme)
          })
        }
      }
    )
  return {
    data () {
      return {
        cssrProps: null
      }
    },
    created () {
      styles.forEach(style => {
        if (process.env.NODE_ENV !== 'production') {
          window.naive.styleRenderingDuration -= performance.now()
        }
        if (style.key) {
          setupMutableStyle(
            this,
            // TODO use `themeKey`
            this.syntheticTheme || this.theme || null,
            style.key,
            style.CNode
          )
        } else {
          setupImmutableStyle(
            this,
            style.CNode
          )
        }
        if (cssrPropsOption && cssrPropsOption.themeKey) {
          setupCssrProps(this, this[cssrPropsOption.themeKey])
        }
        if (process.env.NODE_ENV !== 'production') {
          window.naive.styleRenderingDuration += performance.now()
        }
      })
    },
    watch
  }
}