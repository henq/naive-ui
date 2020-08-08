import create from '../../../styles/_utils/create-component-base'

export default create({
  name: 'BaseSuffix',
  theme: 'dark',
  getDerivedVariables ({ base, derived }) {
    return {
      default: {
        crossColor: derived.quaternaryTextOverlayColor,
        hoverCrossColor: derived.primaryHoverColor,
        activeCrossColor: derived.primaryActiveColor,
        arrowColor: derived.quaternaryTextOverlayColor,
        hoverArrowColor: derived.primaryHoverColor,
        activeArrowColor: derived.primaryHoverColor,
        disabledArrowColor: derived.quinaryTextOverlayColor
      },
      warning: {
        crossColor: derived.warningColor,
        hoverCrossColor: derived.warningHoverColor,
        activeCrossColor: derived.warningActiveColor,
        arrowColor: derived.warningColor,
        hoverArrowColor: derived.warningHoverColor,
        activeArrowColor: derived.warningHoverColor,
        disabledArrowColor: derived.quinaryTextOverlayColor
      },
      error: {
        crossColor: derived.errorColor,
        hoverCrossColor: derived.errorHoverColor,
        activeCrossColor: derived.errorActiveColor,
        arrowColor: derived.errorColor,
        hoverArrowColor: derived.errorHoverColor,
        activeArrowColor: derived.errorHoverColor,
        disabledArrowColor: derived.quinaryTextOverlayColor
      }
    }
  }
})