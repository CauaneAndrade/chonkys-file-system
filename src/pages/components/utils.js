function getParent(currentPath, fileMap, lista) {
    const currentObj = fileMap[currentPath]
    const parentName = currentObj['parentId']
    lista.push(currentObj['name'])
    const pai = Object.entries(fileMap).filter((i) => i[1]['name'] == parentName)[0]
    if (pai) { getParent(pai[1]['id'], fileMap, lista) }
    return lista
}

export default getParent
