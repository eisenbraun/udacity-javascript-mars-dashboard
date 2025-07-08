const store = Immutable.Map({
    photos: [],
    rover: '',
    rovers: ['Curiosity', 'Opportunity', 'Spirit'],
})

// add our markup to the page
const root = document.getElementById('root')

const updateStore = (store, newState) => {
    render(root, store.merge(newState))
}

const render = async (root, state) => {
    root.innerHTML = App(state)
}

const load = (state, ...comps) => {
    return comps.reduce((html, comp) => (html + comp(state)), ``)
}

const formatDate = (string) => {
    const date = new Date(string)
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }
    
    return date.toLocaleDateString('en-US', options)
}

// create content
const App = (state) => {    
    return load(state, Form, Photos)
}


// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    render(root, store)
})

document.body.addEventListener('change', (e) => {
   updateStore(store, {rover: e.target.value, photos: []})
})

// ------------------------------------------------------  COMPONENTS

const Form = (state) => {
    return (`
    <form class="form p-5 bg-light border border-1 mb-5">
        <div class="form-group">
            <label class="form-label">Rovers</label>
            <select class="form-select" id="rover">
                <option value="">Select a Rover</option>
                ${state.toJS().rovers.map(rover => 
                    `<option ${rover === state.toJS().rover ? 'selected' : ''}>${rover}</option>`
                ).join('')}
            </select>
        </div>
    </form>    
    `)
}

const Photos = (state) => {
    if (state.toJS().photos.length === 0 && state.toJS().rover) {
        getPhotos(state)
        return ''
    }
    
    if (state.toJS().rover) {
        return (`
        <div class="results">
            <h2>${state.toJS().rover} Rover</h2>
            <p class="mb-3">
                The ${state.toJS().photos[0].rover.name} rover was launched on ${formatDate(state.toJS().photos[0].rover.launch_date)} and landed on ${formatDate(state.toJS().photos[0].rover.landing_date)}. ${state.toJS().photos[0].rover.name}'s status is ${state.toJS().photos[0].rover.status}.
            </p>
            <h3>Photos for ${formatDate(state.toJS().photos[0].earth_date)}</h3>
            <div class="gallery">
                ${state.toJS().photos.reduce((html, photo) => 
                    (html + `
                        <object data="${photo.img_src}"><img src="https://placehold.co/800x800?text=Image+Not+Available" alt="${photo.full_name || photo.camera.full_name}"></object>`), '')}
            </div>
        </div>`)
    }
    
    return ''
}

// ------------------------------------------------------  API CALLS

const getPhotos = (state) => {
    // const { photos } = state

    fetch(`http://localhost:3000/mars/${state.toJS().rover}`)
        .then(res => res.json())
        .then(json => { 
            updateStore(state, json) 
        })
}
