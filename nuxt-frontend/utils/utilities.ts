function to_mutable(list: Array<any>) {
    return list.map(function(obj) {
        return Object.assign({}, obj);
    })
}
