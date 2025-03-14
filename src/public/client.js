const store = {
    photos: [],
    rover: '',
    rovers: ['Curiosity', 'Opportunity', 'Spirit'],
}

// add our markup to the page
const root = document.getElementById('root')

const updateStore = (store, newState) => {
    store = Object.assign(store, newState)
    render(root, store)
}

const render = async (root, state) => {
    root.innerHTML = App(state)
}

const load = (state, ...comps) => {
    return comps.reduce((html, comp) => (html + comp(state)), ``)
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
    updateStore(store, {'rover': e.target.value})
})

// ------------------------------------------------------  COMPONENTS

const Form = (state) => {
    return (`
    <form class="p-5 bg-light border border-1 mb-3">
        <div class="form-group">
            <label class="form-label">Rovers</label>
            <select class="form-select" id="rover">
                <option>Select a Rover</option>
                ${state.rovers.map(rover => 
                    `<option ${rover === state.rover ? 'selected' : ''}>${rover}</option>`
                ).join('')}
            </select>
        </div>
    </form>    
    `)
}

const Photos = (state) => {
    if (state.photos.length === 0) {
        getPhotos(state)
    }
    
    return (`
    <h2 class="mb-3">Latest Photos</h2>
    <div class="gallery">
        ${state.photos.reduce((html, photo) => 
            (html + `<img src="${photo.img_src}" alt="${photo.full_name}">`), '')}
    </div>`)
}

// ------------------------------------------------------  API CALLS

const getPhotos = (state) => {
    // const { photos } = state
    
    fetch(`http://localhost:3000/mars`)
        .then(res => res.json())
        .then(json => {
            updateStore(state, json) 
        })
}
