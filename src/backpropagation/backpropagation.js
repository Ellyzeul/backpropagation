class Backpropagation {
    #connections = []
    #transferType
    #transfer
    #derivative
    #inNeurons
    #outNeurons
    #layers
    #neuronsPerLayer
    #learningRate

    constructor(neuronsPerLayer, inNeurons, outNeurons, layers, transferFun, learningRate) {
        this.#transfer = this.#transferFunctions(transferFun)
        this.#derivative = this.#transferDerivatives(transferFun)
        this.#learningRate = learningRate
        this.#transferType = transferFun
        this.#inNeurons = inNeurons
        this.#outNeurons = outNeurons
        this.#layers = layers
        this.#neuronsPerLayer = neuronsPerLayer
        let layerName
        let nextLayerName

        for(let i = 0; i < neuronsPerLayer; i++) {
            for (let j = 0; j < inNeurons; j++) {
                this.#connections.push(
                    {
                        from: `in${j}`,
                        to: `A${i}`,
                        in: true
                    }
                )
            }
        }

        for(let i = 0; i < layers-1; i++) {
            layerName = this.#neuronLayerName(i)
            nextLayerName = this.#neuronLayerName(i+1)
            for (let j = 0; j < neuronsPerLayer; j++) {
                for(let k = 0; k < neuronsPerLayer; k++) {
                    this.#connections.push(
                        {
                            from: `${layerName}${k}`,
                            to: `${nextLayerName}${j}`,
                            weight: 0.1
                        }
                    )
                }
            }
        }

        layerName = this.#neuronLayerName(layers-1)
        for(let i = 0; i < outNeurons; i++) {
            for (let j = 0; j < neuronsPerLayer; j++) {
                this.#connections.push(
                    {
                        from: `${layerName}${j}`,
                        to: `out${i}`,
                        weight: 0.1,
                        out: true
                    }
                )
            }
        }
    }

    #transferFunctions = type => 
        type === "linear" ? (x) => (x)
      : type === "logistic" ? (x) => (1/(1+Math.exp(-x)))
      : type === "hyperbolic tangent" ? (x) => ((1-Math.exp(-2*x))/(1+Math.exp(-2*x)))
      : null

    #transferDerivatives = type => 
        type === "linear" ? (x) => (1)
      : type === "logistic" ? (x) => (Math.exp(-x)/Math.pow((1+Math.exp(-x)), 2))
      : type === "hyperbolic tangent" ? (x) => (1-Math.pow(this.#transferFunctions("hyperbolic tangent")(x), 2))
      : null

    #neuronLayerName = code => {
        let name = ""
        let divisions = Math.floor(code/26)
        let i = 0
        while(divisions > 0) {
            name = `${name}${String.fromCharCode((divisions%26 - 1) + 65)}`
            divisions = Math.floor(divisions/26)
        }
        name = `${name}${String.fromCharCode(code%26 + 65)}`
    
        return name
    }

    process = entry => {
        const layerNets = []
        const inputs = [...entry]
        const output = {
            layerNets: [],
            final: []
        }
        const weights = []
        let l = 0
        for(let i = 0; i < this.#layers; i++) {
            for(let j = 0; j < this.#neuronsPerLayer; j++) {
                for(let k = 0; k < (i === 0 ? this.#inNeurons : this.#neuronsPerLayer); k++, l++) {
                    console.log(this.#connections[l])
                    weights.push(this.#connections[l].weight||1)
                }
                layerNets.push(this.#net(inputs, weights))
                weights.length = 0
            }
            inputs.length = 0

            output.layerNets.push([...layerNets])
            layerNets.forEach(net => inputs.push(this.#transfer(net)))

            layerNets.length = 0
        }

        for(let i = 0; i < this.#outNeurons; i++) {
            for(let j = 0; j < this.#neuronsPerLayer; j++) {
                weights.push(this.#connections[l++].weight)
            }
            layerNets.push(this.#net(inputs, weights))
            weights.length = 0
        }
        output.layerNets.push([...layerNets])
        layerNets.forEach(net => output.final.push(this.#transfer(net)))

        return output
    }

    #net = (inputs, weights, bias=0) => {
        const len = weights.length
        let netValue = bias
        for(let i = 0; i < len; i++) {
            netValue += inputs[i] * weights[i]
        }

        return netValue
    }

    train = (set, stopCond, stopValue) => {
        const stop = (i, error) => stopCond === "error"
            ? error >= stopValue
            : stopCond === "iterations"
                ? i < stopValue
                : (() => {throw "Unexpected stop condition..."})()
        const len = set.length
        const startOn = (set.filter(row => row[row.length-1] === 0).length === 0 ? 0 : 1)
        let error = 1
        let resultsError
        let iteration

        for(let i = 0; stop(i, error); i++) {
            for(let j = 0; j < len; j++) {
                iteration = this.process(set[j])

                resultsError = iteration.final
                    .map((result, idx) => 
                        ((idx === set[i][this.#inNeurons] ? 1 : 0) - result + startOn) * (iteration.layerNets[iteration.layerNets.length-1][idx])
                    )
                
                this.#backpropagate(iteration.layerNets, resultsError)
            }
        }
    }

    #backpropagate = (results, outputError) => {
        let l = this.#connections.length-1
        console.log(results)

        for(let i = this.#outNeurons-1; i >= 0; i--) {
            for(let j = this.#neuronsPerLayer-1; j >= 0; j--, l--) {
                this.#connections[l].weight *= this.#derivative()*results[this.#layers][j]
            }
        }

        for(let i = this.#layers-2; i >= 0; i--) {
            for(let j = this.#neuronsPerLayer-1; j >= 0; j--) {
                console.log()
                console.log(`x == ${i+1} || y == ${j}`)
                for(let k = this.#neuronsPerLayer-1; k >= 0; k--, l--) {
                    console.log(this.#connections[l])
                    console.log(`x == ${i+2} || y == ${k}`)
                }
            }
        }

        for(let i = this.#neuronsPerLayer-1; i >= 0; i--) {
            console.log()
            for(let j = this.#inNeurons-1; j >= 0; j--, l--) {
                console.log(this.#connections[l])
            }
        }
    }

    test = entry => this.process(entry).final
}