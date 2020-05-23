export class ViewOtherUser {
    // @ts-ignore
    constructor({id, name, profileImageUrl, pocks, badge}) {
        this.id = id;
        this.name = name;
        this.profileImageUrl = profileImageUrl;
        this.pocks = pocks;
        this.badge = badge
    }

    id: string
    name: string
    profileImageUrl: string
    badge: number
    pocks: number
}