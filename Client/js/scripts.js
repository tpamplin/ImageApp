const url = "http://AC2-load-balancer-1599047323.us-east-2.elb.amazonaws.com:8080/images";

const bucketUrl = "https://2-6-image-bucket.s3.us-east-2.amazonaws.com/";

const handleUpload = () => {
    uploadFile();
    setTimeout(() => {
        location.reload();
    }, 1000);
};

const uploadFile = async () => {
    const fileInput = document.getElementById("file-upload");
    const file = fileInput.files[0];

    if (!file) {
        alert("Select a file");
        return;
    }

    const formData = new FormData();
    formData.append("file", file);

    await fetch(url, {
        method: "POST",
        body: formData,
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP Error! status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            console.log("Success: ", data);
        })
        .catch((error) => {
            console.error("Error: ", error);
        });
};

const loadFiles = async () => {
    const library = document.getElementById("image-library");

    while (library.firstChild) {
        library.removeChild(library.lastChild);
    }

    try {
        const response = await fetch(url);

        if (response.ok) {
            const result = await response.json();
            console.log(result);

            for (let i = 0; i < result.length; i++) {
                const key = result[i];

                const imageEntry = document.createElement("div");
                imageEntry.setAttribute("class", "image-list-entry");

                const fileName = document.createElement("p");
                const textNode = document.createTextNode(key);
                fileName.appendChild(textNode);

                const displayImage = document.createElement("img");
                displayImage.setAttribute("src", bucketUrl + key);
                displayImage.setAttribute("class", "display-image");

                const downloadLink = document.createElement("a");
                downloadLink.setAttribute("href", bucketUrl + key);

                const downloadLinkText = document.createTextNode("View Image");
                downloadLink.appendChild(downloadLinkText);

                imageEntry.appendChild(fileName);
                imageEntry.appendChild(displayImage);
                imageEntry.appendChild(downloadLink);

                library.appendChild(imageEntry);
            }
        } else {
            console.error(error);
            alert("Failed to load library.");
        }
    } catch (error) {
        console.error(error);
        alert("something went wrong while trying to load library.");
    }
};

loadFiles();
