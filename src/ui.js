// Init

const stopConditions = document.querySelectorAll('input[name="stop_condition"]')
stopConditions[0]
    .addEventListener('change', () => document.querySelector('#iteration_number').disabled = true)
stopConditions[1]
    .addEventListener('change', () => document.querySelector('#iteration_number').disabled = false)

stopConditions[0].checked = true

const stopInput = document.querySelector('#iteration_number')
stopInput.disabled = true
stopInput.value = ''


const hiddenNeurons = document.querySelectorAll('input[name="hidden_neuron_number"]')
hiddenNeurons[0]
    .addEventListener('change', () => document.querySelector('#user_neuron_number').disabled = true)
hiddenNeurons[1]
    .addEventListener('change', () => document.querySelector('#user_neuron_number').disabled = false)

hiddenNeurons[0].checked = true

const neuronInput = document.querySelector('#user_neuron_number')
neuronInput.disabled = true
neuronInput.value = ''


document.querySelector('input[name="transfer_function"]').checked = true