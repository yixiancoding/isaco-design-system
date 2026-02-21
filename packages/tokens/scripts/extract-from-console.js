// Run this in Figma Desktop Plugin Console
// Plugins → Development → Open Console
// Then paste this entire script and press Enter

async function extractVariables() {
  const collections = await figma.variables.getLocalVariableCollectionsAsync()
  const result = { collections: {}, variables: {} }

  for (const collection of collections) {
    result.collections[collection.id] = {
      id: collection.id,
      name: collection.name,
      modes: collection.modes,
      variableIds: collection.variableIds
    }

    for (const varId of collection.variableIds) {
      const variable = await figma.variables.getVariableByIdAsync(varId)
      if (variable) {
        result.variables[variable.id] = {
          id: variable.id,
          name: variable.name,
          resolvedType: variable.resolvedType,
          valuesByMode: variable.valuesByMode
        }
      }
    }
  }

  console.log('✅ Variables extracted! Copy the output below:')
  console.log(JSON.stringify(result, null, 2))
  return result
}

extractVariables()
