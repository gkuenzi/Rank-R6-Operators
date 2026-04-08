


export function situationScale() {
    const scale = [
        {
            type: 'attack',
            situation: 'Early entry frag, attempting to gain main advantage early',
            general: 10,
            support: 0,
            fragging: 10,
            intel: 0,
            entry: 10,
            roam: 0,
            vert: 0
        },
        {
            type: 'defense',
            situation: 'Offsite / Roaming',
            general: 10,
            support: 0,
            fragging: 10,
            intel: 0,
            entry: 0,
            roam: 10,
            vert: 0
        },
        {
            type: 'defense',
            situation: 'post-plant situation',
            general: 10,
            support: 0,
            fragging: 5,
            intel: 0,
            entry: 0,
            roam: 0,
            vert: 0
        },
        {
            type: 'defense',
            situation: 'set up sight and deny enemy utility',
            general: 10,
            support: 0,
            fragging: 0,
            intel: 0,
            entry: 0,
            roam: 0,
            vert: 0
        },
        {
            type: 'defense',
            situation: 'flexible; can be both and anchor and roamer',
            general: 10,
            support: 5,
            fragging: 5,
            intel: 5,
            entry: 0,
            roam: 5,
            vert: 0
        },
        {
            type: 'attack',
            situation: 'taking space vertically on the map (above or below sight)',
            general: 10,
            support: 5,
            fragging: 0,
            intel: 5,
            entry: 0,
            roam: 0,
            vert: 10
        },{
            type: 'all',
            situation: 'gain intel about the opposing team',
            general: 10,
            support: 10,
            fragging: 0,
            intel: 10,
            entry: 0,
            roam: 0,
            vert: 0
        },{
            type: 'attack',
            situation: 'take space off-site; take control of rooms',
            general: 10,
            support: 0,
            fragging: 0,
            intel: 0,
            entry: 10,
            roam: 10,
            vert: 0
        },{
            type: 'all',
            situation: 'Deny plant/diffuse from floor above or below',
            general: 10,
            support: 0,
            fragging: 0,
            intel: 0,
            entry: 0,
            roam: 10,
            vert: 10
        },{
            type: 'defense',
            situation: 'Deny the attackers from planting',
            general: 10,
            support: 10,
            fragging: 0,
            intel: 5,
            entry: 0,
            roam: 0,
            vert: 0
        },{
            type: 'all',
            situation: 'fragging (getting kills)',
            general: 10,
            support: 0,
            fragging: 10,
            intel: 0,
            entry: 0,
            roam: 0,
            vert: 0
        },{
            type: 'all',
            situation: '',
            general: 10,
            support: 0,
            fragging: 0,
            intel: 0,
            entry: 0,
            roam: 0,
            vert: 0
        },
        {
            type: 'all',
            situation: '',
            general: 10,
            support: 0,
            fragging: 0,
            intel: 0,
            entry: 0,
            roam: 0,
            vert: 0
        },
        {
            type: 'all',
            situation: '',
            general: 10,
            support: 0,
            fragging: 0,
            intel: 0,
            entry: 0,
            roam: 0,
            vert: 0
        },
        {
            type: 'all',
            situation: '',
            general: 10,
            support: 0,
            fragging: 0,
            intel: 0,
            entry: 0,
            roam: 0,
            vert: 0
        },
        {
            type: 'all',
            situation: '',
            general: 10,
            support: 0,
            fragging: 0,
            intel: 0,
            entry: 0,
            roam: 0,
            vert: 0
        },
        {
            type: 'all',
            situation: '',
            general: 10,
            support: 0,
            fragging: 0,
            intel: 0,
            entry: 0,
            roam: 0,
            vert: 0
        },
        {
            type: 'all',
            situation: '',
            general: 10,
            support: 0,
            fragging: 0,
            intel: 0,
            entry: 0,
            roam: 0,
            vert: 0
        },
    ]

    return scale;
}