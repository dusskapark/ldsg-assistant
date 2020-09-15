import CoreAssistant from '@sketch-hq/sketch-core-assistant'
import { AssistantPackage, RuleDefinition } from '@sketch-hq/sketch-assistant-types'

const textDisallow: RuleDefinition = {
  rule: async (context) => {
    const { utils } = context

    // Get a configuration option named "pattern"
    const pattern = utils.getOption('pattern')
    if (typeof pattern !== 'string') throw Error()

    // Iterate
    for (const layer of utils.objects.text) {
      const value = layer.attributedString.string
      // Test
      if (value.includes(pattern)) {
        // Report
        utils.report(`Layer “${layer.name}” contains “${pattern}”`, layer)
      }
    }
  },
  name: 'ldsg-assistant/text-disallow',
  title: (config) => `Text should not contain "${config.pattern}"`,
  description: 'Reports a violation when text layers contain a configurable text pattern',
}

const assistant: AssistantPackage = [
  CoreAssistant,
  async () => {
    return {
      name: 'ldsg-assistant',
      rules: [textDisallow],
      config: {
        rules: {
          '@sketch-hq/sketch-core-assistant/symbols-no-unused': { active: true },
          '@sketch-hq/sketch-core-assistant/symbols-no-detached': { active: true },
          '@sketch-hq/sketch-core-assistant/layer-styles-prefer-shared': {
            active: false,
            maxIdentical: 2,
          },
          '@sketch-hq/sketch-core-assistant/text-styles-prefer-shared': {
            active: false,
            maxIdentical: 2,
          },
          'ldsg-assistant/text-disallow': {
            pattern: 'Type something',
            active: false,
          },
        },
      },
    }
  },
]

export default assistant
