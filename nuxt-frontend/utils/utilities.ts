export function to_mutable(list: Array<any>) {
    return list.map(function(obj) {
        return Object.assign({}, obj);

    })
}


export function truncateString(str: string) {
    let maxLength = 18;
    if (str.length <= maxLength) {
        return str;
    } else {
        return str.substring(0, maxLength) + '...';
    }
}


export function copy(str: string) {
    navigator.clipboard.writeText(str);
}


export function uuid() {
    return Array
     .from(Array(16))
     .map(e => Math.floor(Math.random() * 255)
     .toString(16)
     .padStart(2,"0"))
     .join('')
     .match(/.{1,4}/g)
     .join('-')
}


export class LocalDB<T> {
    /**
     * localStorage wrapper to make it like ORM for multiple values
     */

    name: string;
    exists: boolean;

    constructor (name: string) {
        this.name = name;
        this.exists = localStorage.getItem(name) != null;
    }

    set(value: T[]) {
        localStorage.setItem(this.name, JSON.stringify(value));
    }

    get(): T[] {
        let list = JSON.parse(localStorage.getItem(this.name));
        if (list == null) {
            return [];
        }

        return list;
    }

    index(index: number) {
        let list = this.get();
        return list[index]
    }

    add(value: T) {
        let list = this.get();
        list.push(value);
        this.set(list);
    }

    remove(index: number) {
        let list = this.get();
        list.splice(index, 1);
        this.set(list);
    }

    clear() {
        localStorage.setItem(this.name, "[]");
    }

}


export class LocalKV {
    /**
     * localStorage wrapper for single string
     */

    name: string;
    exists: boolean;

    constructor (name: string) {
        this.name = name;
        this.exists = localStorage.getItem(name) != null;
    }

    set(value: string) {
        localStorage.setItem(this.name, value);
    }

    get(): string {
        let val = localStorage.getItem(this.name);
        return val
    }

    clear() {
        localStorage.setItem(this.name, null);
    }
}
