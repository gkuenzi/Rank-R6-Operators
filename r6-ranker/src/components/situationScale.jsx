


export function situationScale() {
    const scale = [
            // ---- All ----
    {
        type: 'all',
        situation: 'Gain intel about the opposing team',
        general: 10,
        support: 10,
        fragging: 0,
        intel: 10,
        entry: 0,
        roam: 0,
        vert: 0
    },
    {
        type: 'all',
        situation: 'Deny plant/diffuse from floor above or below',
        general: 10,
        support: 0,
        fragging: 3,
        intel: 3,
        entry: 0,
        roam: 10,
        vert: 10
    },
    {
        type: 'all',
        situation: 'Fragging (Getting kills)',
        general: 10,
        support: 0,
        fragging: 10,
        intel: 0,
        entry: 0,
        roam: 3,
        vert: 0
    },
    {
        type: 'all',
        situation: 'Get rid of enemy utility',
        general: 10,
        support: 5,
        fragging: 1,
        intel: 7,
        entry: 6,
        roam: 0,
        vert: 0
    },
    {
        type: 'all',
        situation: 'Clutch a 1v5',
        general: 10,
        support: 2,
        fragging: 10,
        intel: 4,
        entry: 3,
        roam: 0,
        vert: 1
    },


    // ---- Attack ----
    {
        type: 'attack',
        situation: 'Early entry frag, attempting to gain man advantage early',
        general: 10,
        support: 0,
        fragging: 10,
        intel: 0,
        entry: 10,
        roam: 0,
        vert: 0
    },
    {
        type: 'attack',
        situation: 'Taking space vertically on the map (above or below sight)',
        general: 10,
        support: 5,
        fragging: 0,
        intel: 5,
        entry: 0,
        roam: 0,
        vert: 10
    },
    {
        type: 'attack',
        situation: 'Take space off-site; take control of rooms',
        general: 10,
        support: 3,
        fragging: 3,
        intel: 0,
        entry: 10,
        roam: 10,
        vert: 0
    },

    // ---- Defense ----
    {
        type: 'defense',
        situation: 'Offsite / Roaming',
        general: 10,
        support: 0,
        fragging: 10,
        intel: 3,
        entry: 0,
        roam: 10,
        vert: 3
    },
    {
        type: 'defense',
        situation: 'Post-plant situation',
        general: 10,
        support: 0,
        fragging: 5,
        intel: 5,
        entry: 0,
        roam: 0,
        vert: 2
    },
    {
        type: 'defense',
        situation: 'Set up sight and deny enemy utility',
        general: 10,
        support: 10,
        fragging: 2,
        intel: 6,
        entry: 0,
        roam: 0,
        vert: 0
    },
    {
        type: 'defense',
        situation: 'Flexible; Can be both and anchor and roamer',
        general: 10,
        support: 5,
        fragging: 5,
        intel: 5,
        entry: 0,
        roam: 5,
        vert: 0
    },
    {
        type: 'defense',
        situation: 'Deny the attackers from planting',
        general: 10,
        support: 10,
        fragging: 0,
        intel: 5,
        entry: 0,
        roam: 0,
        vert: 2
    },
    {
        type: 'defense',
        situation: 'Delay attackers / Waste time without taking fights',
        general: 10,
        support: 8,
        fragging: 2,
        intel: 5,
        entry: 0,
        roam: 10,
        vert: 0
    },
    ]

    return scale;
}