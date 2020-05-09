export class UserProfileNameImage {
    // @ts-ignore
    constructor({id, name, profileImageUrl}) {
        this.id = id;
        this.name = name;
        this.profileImageUrl = profileImageUrl;
    }

    id: string
    name: string
    profileImageUrl: string
}