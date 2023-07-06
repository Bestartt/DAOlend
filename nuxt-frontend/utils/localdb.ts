export class LocalDB<T> {
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
