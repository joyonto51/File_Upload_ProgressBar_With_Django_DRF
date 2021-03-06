console.log('hello world')

const uploadForm = document.getElementById('upload-form')
const input = document.getElementById('id_image')
const uploadButton = document.getElementById('upload-button')
console.log(input)

const alertBox = document.getElementById('alert-box')
// const imageBox = document.getElementById('image-box')
const progressBox = document.getElementById('progress-box')
const cancelBox = document.getElementById('cancel-box')
const cancelBtn = document.getElementById('cancel-btn')

const csrf = document.getElementsByName('csrfmiddlewaretoken')

uploadButton.addEventListener('click', ()=>{
    progressBox.classList.remove('not-visible')
    cancelBox.classList.remove('not-visible')

    const img_data = input.files[0]
    const url = URL.createObjectURL(img_data)
    console.log(img_data)

    const fd = new FormData()
    // fd.append('csrfmiddlewaretoken', csrf[0].value)
    fd.append('image', img_data)

    $.ajax({
        type:'POST',
        url: 'http://127.0.0.1:8005/upload/',
        enctype: 'multipart/form-data',
        data: fd,
        headers: {'Authorization':'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIi' +
            'wiZXhwIjoxNjE3Nzk1MzUyLCJqdGkiOiI3NmEzODA1Y2FjOTg0MWE1Yjc0MmZhMWQ2NjAxMGM4ZCIsInV' +
            'zZXJfaWQiOjJ9.LYtEv7Resw9klU-ISqYjj3D2EPg4U-aJFTXwqTB9k0U'},

        beforeSend: function(){
            console.log('before')
            alertBox.innerHTML= ""
            // imageBox.innerHTML = ""
        },
        xhr: function(){
            const xhr = new window.XMLHttpRequest();
            xhr.upload.addEventListener('progress', e=>{
                // console.log(e)
                if (e.lengthComputable) {
                    const percent = e.loaded / e.total * 100
                    console.log(percent)
                    progressBox.innerHTML = `<div class="progress">
                                                <div class="progress-bar" role="progressbar" style="width: ${percent}%" aria-valuenow="${percent}" aria-valuemin="0" aria-valuemax="100"></div>
                                            </div>
                                            <p>${percent.toFixed(1)}%</p>`
                }

            })
            cancelBtn.addEventListener('click', ()=>{
                xhr.abort()
                setTimeout(()=>{
                    uploadForm.reset()
                    progressBox.innerHTML=""
                    alertBox.innerHTML = ""
                    cancelBox.classList.add('not-visible')
                }, 2000)
            })
            return xhr
        },
        success: function(response){
            console.log(response)
            // imageBox.innerHTML = `<img src="${url}" width="300px">`
            alertBox.innerHTML = `<div class="alert alert-success" role="alert">
                                    The file has been uploaded successfully
                                </div>`
            cancelBox.classList.add('not-visible')
        },
        error: function(error){
            console.log(error)
            alertBox.innerHTML = `<div class="alert alert-danger" role="alert">
                                    Ups... something went wrong
                                </div>`
        },
        cache: false,
        contentType: false,
        processData: false,
    })
})

