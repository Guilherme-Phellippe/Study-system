import db from "./firebase.js";
// const base_url = "https://study-system.herokuapp.com"
// const url_matters = base_url+"/matter"
// const url_createAsk = base_url+"/ask/add-ask/"
// const url_deleteAsk = base_url+"/ask/delete/"

//matters
export async function getMatters() {
    let matters = []
    const data = await db().collection("matters").get();
    data.docs.map((value) => {
        matters.push(value.data())
    })
    return matters
}

export async function addMatter(matter) {
    db.collection('matters').add({
        matters: matter
    })
    alert('Inserido com sucesso!')
}
//search one matter
export async function getMatter(id) {
    const matters = []
    const data = await db().collection("matters").where("id", "==", id).get();
    data.docs.map((value) => {
        matters.push(value.data())
    })
    return matters
}

//update one matter
export async function updateMatter(id, matter) {
    db().collection("matters").where('id','==', id).get().then((querySnapshot) =>{
        querySnapshot.docs.forEach(async (doc) =>{
            doc.ref.update(matter)
        })
        return true;
    }).catch(() =>{
        return false;
    })
}

//delete onde matter
export async function deleteMatter(id) {
    const res = axios.delete(url_matters + "/" + id).catch(err => console.error(err))
    return res
}
//asks
//create one ask
export async function getAsks(id) {
    const asks = []
    const data = await db().collection("asks").where("id_matter", "==", id).get();
    data.docs.map((value) => {
        asks.push(value.data())
    })
    return asks
}


export async function createAsk(id, ask) {
    const nmr = await getMatter(id);
    var idAsk = null

    await db().collection("asks").get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
            idAsk = doc.id;
        });
    });

    db().collection("asks").doc(idAsk).update({
        content: db.FieldValue.arrayUnion(ask)
    }).then(function () {
        alert("Salvo com sucesso")
    });
}

//delete one ask
export async function deleteAsk(id, index) {
    const res = await axios.patch(url_deleteAsk + id, index).catch(err => console.error(err));
    return res
}