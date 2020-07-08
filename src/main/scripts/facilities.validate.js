module.exports = registry => {
  /* is the registry sorted */
  for (let i = 1; i < registry.length; i++) {
    if (registry[i-1].code >= registry[i].code) {
      throw name + " registry key " + registry[i-1].code + " is " +
        ((registry[i-1].code === registry[i].code) ? "duplicated" : "not sorted");
    }
  }
}
