const posts = document.querySelector(".posts");
const btnSend = document.querySelector("#sendPost");
const btnEditMode = document.querySelector("#edit-mode");

// send post to the database
const sendPost = async (data) => {
	// to localhost
	const res = await fetch("http://localhost:3000/posts", {
		method: "POST",
		headers: {
			"Content-type": "application/json",
		},
		body: JSON.stringify(data),
	});
	const resData = await res.json();
};

// fetch data from database
const fillDom = async () => {
	const res = await fetch("http://localhost:3000/posts");
	const postsData = await res.json();
	// for each post create and element for dom
	postsData.forEach((postData) => {
		const { title, body, id } = postData;

		const post = document.createElement("div");
		post.className = "post";
		// post has id for delete and edit
		post.id = id;
		// post element innerHtml has 2 button
		// one is for edit
		// the other one is delete
		post.innerHTML = `
    <div class="title">
					<p>
						${title}
					</p>
				</div>
				<div class="body">
					<p>${body}</p>

					<div class="tools">
          <button id="edit" class="btn">
          <i class="fa-solid fa-pen-to-square"></i>
          </button>
          <button id="delete" class="btn">
            <i class="fa-solid fa-trash-can"></i>
          </button>
					</div>
				</div>
    `;

		// take these buttons(edit and delete from their id's)
		const btnDelete = post.querySelector("#delete");
		const btnEdit = post.querySelector("#edit");

		// event listener for delete button
		btnDelete.addEventListener("click", (e) => {
			e.preventDefault();
			// deleted selected post
			deletePost(post);
		});

		// event listener for edit button
		btnEdit.addEventListener("click", (e) => {
			e.preventDefault();

			// if already edit button is clicked
			if (btnEditMode.classList.contains("show")) {
				// then toggle class again
				btnEditMode.classList.toggle("show");
				btnSend.classList.toggle("hide");

				// and remove from input and text area
				document.querySelector("#title").value = "";
				document.querySelector("#body").value = "";
			} else {
				//if edit button clicked once for edit
				// found id from post itself
				const selectedId = +post.id;
				// title value set with post title
				document.querySelector("#title").value =
					post.querySelector(".title").innerText;

				// body value set with post body
				document.querySelector("#body").value =
					post.querySelector(".body").innerText;

				// btnSend and btnEditMode chance their place with toggle classes
				btnEditMode.classList.toggle("show");
				btnSend.classList.toggle("hide");

				// btnEditMode evet listener
				btnEditMode.addEventListener("click", (e) => {
					// create new object for edited post
					const editedData = {};

					// set title and body new edited post
					editedData.title = document.querySelector("#title").value;
					editedData.body = document.querySelector("#body").value;

					// if textarea and input values are not empty
					if (editedData.title.trim() != "" && editedData.body.trim()) {
						// send new data to database
						sendEditedData(selectedId, editedData);
					}
				});
			}
		});

		// post element goes to posts element as a child
		posts.appendChild(post);
	});
};

// takes new edited data and its id
const sendEditedData = async (id, data) => {
	const res = await fetch(`http://localhost:3000/posts/${id}`, {
		method: "PUT",
		headers: {
			"Content-type": "application/json",
		},
		body: JSON.stringify(data),
	});

	// again toggle btnEditMode and btnSend class, and change their place
	btnEditMode.classList.toggle("show");
	btnSend.classList.toggle("hide");

	// for nice transition
	const resData = setTimeout(() => {
		res.json();
	}, 600);
};

// delete post
const deletePost = async (post) => {
	// found id from post and turn into number wiht(+) sign
	const idForDelete = +post.getAttribute("id");
	fetch(`http://localhost:3000/posts/${idForDelete}`, {
		method: "DELETE",
	});
};

// send post event listeners
btnSend.addEventListener("click", (e) => {
	e.preventDefault();
	// set textarea value and input value to title and body
	const title = document.querySelector("#title").value;
	const body = document.querySelector("#body").value;
	if (title.trim() != "" && body.trim() != "") {
		// if they are not empty then create and object which is data
		const data = {};
		// data object has title and body
		data.title = title;
		data.body = body;

		// sent data to database
		sendPost(data);
	}
});

// if database has post, then fecth and fill dome
fillDom();
