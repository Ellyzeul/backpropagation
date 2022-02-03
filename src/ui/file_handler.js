sessionStorage.clear()

const uploadTrainButton = document.querySelector('#upload_train')
const uploadTestsButton = document.querySelector('#upload_tests')


const allowDrop = ev => {
    ev.preventDefault()
}

const fileInputChange = (inputId, file=null) => {
    const reader = new FileReader()

    reader.onload = () => {
        const rawData = reader.result.split("\r\n")

        const data = {
            header: rawData.shift().split(","),
            body: []
        }

        rawData.forEach(row => data.body.push(row.split(",")))
        if(data.body[data.body.length-1][0] === "") data.body.pop()

        sessionStorage.setItem(
            inputId === 'upload_train_input'
            ? 'train_data'
            : 'upload_tests_input'
                ? 'tests_data'
                : inputId,
            JSON.stringify(sortTrainArray(data)))
        
        document.querySelector("#in_neuron").innerHTML = data.header.length-1
        document.querySelector("#out_neuron").innerHTML = data.body
            .map(row => row[row.length-1])
            .filter((value, index, self) => self.indexOf(value) === index)
            .length
    }

    reader.readAsBinaryString((file || document.querySelector(`#${inputId}`).files[0]))

    if(inputId === "upload_train_input") document.querySelector("#start_train").disabled = false
    else if(typeof backpropagation != "undefined") document.querySelector("#start_tests").disabled = false
}

const sortTrainArray = arr => {
    const body = arr.body
    const outputs = body.map(row => row[row.length-1])
        .filter((value, index, self) => self.indexOf(value) === index)
    const totalOuts = outputs.length
    let counter
    let i

    let sorted = []
    let outClasses = []

    outputs.forEach(output => outClasses.push(
        body.filter(row => row[row.length-1] === output)
    ))

    counter = 0
    while(counter < totalOuts) {
        counter = 0
        i = 0
        while(i < totalOuts) {
            row = outClasses[i].pop()
            if(row) sorted.push(row)
            else counter++
            i++
        }
    }

    arr.body = sorted
    return arr
}

const drop = (ev, inputId) => {
    ev.preventDefault()
    fileInputChange(inputId, ev.dataTransfer.files[0])
}