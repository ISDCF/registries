module.exports = (registry, name) => {
  /* is the registry sorted */
  for (let i = 1; i < registry.length; i++) {
    if (registry[i-1].code >= registry[i].code) {
      throw name + " registry key " + registry[i-1].code + " is " +
        ((registry[i-1].code === registry[i].code) ? "duplicated" : "not sorted");
    }

    /* ensure all obsoletedBy codes are found */
    (registry[i].obsoletedBy||[]).forEach(obs => {
      if (!registry.find(r => r.code === obs))
        throw `${name}: ${registry[i].description} is obsoletedBy '${obs}' which is an invalid code`
    })
  }
}
