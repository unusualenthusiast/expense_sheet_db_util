const { getExpenseSubTypeData } = require("../db/getData");

async function trasnformer(data) {
    const res = await getExpenseSubTypeData(data);
    const subType = {};
    res.forEach(x => {
        subType[x.name] = x.id;
    });
    return data.map(({DATE, HH, MM, AM_PM, TYPE, AMOUNT, DESCRIPTION}) => {
        const date = new Date(DATE);
        let _hh = HH;
        if(HH == '12')
            _hh = 0;
        if (AM_PM === 'PM')
            _hh = parseInt(HH, 10) + 12;

        date.setHours(_hh);
        date.setMinutes(MM);
        const _date = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(),
                date.getUTCDate(), date.getUTCHours(),
                date.getUTCMinutes(), date.getUTCSeconds()));

        return {
            createdBy: _date,
            updatedBy: _date,
            subTypeId: subType[TYPE],
            amount: AMOUNT,
            description: DESCRIPTION
        }


    });
}

module.exports = {
    trasnformer
};