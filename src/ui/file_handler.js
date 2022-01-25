sessionStorage.clear()

const uploadTrainButton = document.querySelector('#upload_train')
const uploadTestsButton = document.querySelector('#upload_tests')


const allowDrop = ev => {
    ev.preventDefault()
}

const drop = (ev, storageKey) => {
    ev.preventDefault()
    const reader = new FileReader()

    reader.onload = () => {
        const rawData = reader.result.split("\r\n")

        const data = {
            header: rawData.shift().split(","),
            body: []
        }

        rawData.forEach(row => data.body.push(row.split(",")))
        if(data.body[data.body.length-1][0] === "") data.body.pop()

        sessionStorage.setItem(storageKey, JSON.stringify(data))
        
        document.querySelector("#in_neuron").innerHTML = data.header.length-1
        document.querySelector("#out_neuron").innerHTML = data.body
            .map(row => row[row.length-1])
            .filter((value, index, self) => self.indexOf(value) === index)
            .length
    }

    reader.readAsBinaryString(ev.dataTransfer.files[0])

    if(storageKey === "train_data") document.querySelector("#start_train").disabled = false
    else if(typeof backpropagation != "undefined") document.querySelector("#start_tests").disabled = false
}

const fileInputChange = inputId => {
    const reader = new FileReader()

    reader.onload = () => {
        const rawData = reader.result.split("\r\n")

        const data = {
            header: rawData.shift().split(","),
            body: []
        }

        rawData.forEach(row => data.body.push(row.split(",")))
        if(data.body[data.body.length-1][0] === "") data.body.pop()

        sessionStorage.setItem(inputId === 'upload_train_input' ? 'train_data' : 'tests_data', JSON.stringify(data))
        
        document.querySelector("#in_neuron").innerHTML = data.header.length-1
        document.querySelector("#out_neuron").innerHTML = data.body
            .map(row => row[row.length-1])
            .filter((value, index, self) => self.indexOf(value) === index)
            .length
    }

    reader.readAsBinaryString(document.querySelector(`#${inputId}`).files[0])

    if(inputId === "upload_train_input") document.querySelector("#start_train").disabled = false
    else if(typeof backpropagation != "undefined") document.querySelector("#start_tests").disabled = false
}