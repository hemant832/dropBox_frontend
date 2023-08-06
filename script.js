
        const url = "https://dropbox-b718001c7d18.herokuapp.com"
        const userList = document.getElementById('userList');
        const userListItems = userList.getElementsByClassName('user-list-item');

        function handleUserSelection(event) {
            const selectedUserId = event.target.value;
            console.log(selectedUserId)
            activateUser(selectedUserId);
        }

        for (const listItem of userListItems) {
            listItem.addEventListener('click', () => {
                const userId = listItem.getAttribute('data-user-id');
                activateUser(userId);
            });
        }

        function activateUser(userId) {
            for (const listItem of userListItems) {
                listItem.classList.remove('active');
            }

            const clickedUser = document.querySelector(`[data-user-id="${userId}"]`);
            clickedUser.classList.add('active');

            const uploadContainer = document.getElementById('uploadContainer');
            const fileListHeading = document.querySelector('h2');
            const fileList = document.getElementById('fileList');

            uploadContainer.style.display = 'none';
            fileListHeading.style.display = 'none';
            fileList.style.display = 'none';

            uploadContainer.style.display = 'block';
            fileListHeading.style.display = 'block';
            fileList.style.display = 'block';

            listFiles(userId);
        }

        function uploadFile() {
            const fileInput = document.getElementById('fileInput');
            const file = fileInput.files[0];
            const formData = new FormData();
            formData.append('file', file);
            formData.append('timestamp', new Date().toLocaleString());

            if (file) {
                const activeUserId = getActiveUserId();
                console.log(activeUserId)
                fetch(`${url}/uploadFile/${activeUserId}/`, {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.text())
                .then(message => {
                    alert("file " + file.name + " uploaded successfully");
                    fileInput.value = null;
                    listFiles(activeUserId);
                })
                .catch(error => console.error('Error:', error));
            } else {
                alert('Please choose a file to upload.');
            }


        }
        
        function getActiveUserId() {
            const userListItems = document.getElementsByClassName('user-list-item');
            for (const listItem of userListItems) {

                if (listItem.classList.contains('active')) {
                    return listItem.getAttribute('data-user-id');
                }
            }
            return null; 
        }

        function listFiles(userId) {
            fetch(`${url}/listFiles/${userId}`)
            .then(response => response.json())
            .then(files => {
                const fileList = document.getElementById('fileList');
                fileList.innerHTML = '';

                files.forEach(file => {
                    const listItem = document.createElement('li');
                    listItem.textContent = `${file}`;
                    fileList.appendChild(listItem);
                    const downloadButton = document.createElement('button');
                    downloadButton.textContent = 'Download';
                    downloadButton.className = 'download-button';
                    downloadButton.onclick = () => downloadFile(userId, file);
                    listItem.appendChild(downloadButton);
                });
            })
            .catch(error => console.error('Error:', error));

        }


        function downloadFile(userId, filename) {
            fetch(`${url}/downloadFile/${userId}/${filename}`, {
                method: 'GET'
            })
            .then(response => response.blob())
            .then(blob => {
                const url = window.URL.createObjectURL(new Blob([blob]));
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                a.click();
                window.URL.revokeObjectURL(url);
            })
            .catch(error => console.error('Error:', error));
        }

        listFiles(getActiveUserId());