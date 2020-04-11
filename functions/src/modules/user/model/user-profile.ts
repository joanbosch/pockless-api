import * as moment from 'moment'

export class UserProfile {
    // @ts-ignore
    constructor({id, name, birthDate, mail, profileImageUrl, radiusVisibility, accentColor, badge, pocks}) {
        this.id = id;
        this.name = name;
        this.birthDate = birthDate;
        this.mail = mail;
        this.profileImageUrl = profileImageUrl;
        this.radiusVisibility = radiusVisibility;
        this.accentColor = accentColor;
        this.pocks = pocks;
        this.badge = badge
    }

    id: string
    name: string
    birthDate: string
    mail: string
    profileImageUrl: string
    // settings
    radiusVisibility: number
    badge: number
    pocks: number
    accentColor: string


    isOlderThan18() {
        return moment().diff(moment(this.birthDate, 'DD/MM/YYYY'), 'years') >= 18
    }

}
