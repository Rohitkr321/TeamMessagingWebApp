let chanel = document.getElementById("chanel");
let member = document.getElementById("addMember");
let rightChanelPanel = document.getElementById("rightChanel")
let postButton = document.getElementById("post")
let postDiv = document.getElementById("postDiv")
let alertNotification = document.getElementById("alert");


let chanelIds;


function verifytrueorfalse() {
	let request = new XMLHttpRequest();
	request.open("get", `/verifyornot`);
	request.send();
	request.addEventListener("load", () => {
		let data = ""
		let notVerifyChanel = JSON.parse(request.responseText)
		//console.log(notVerifyChanel)
		let notVerifys = notVerifyChanel.notverify
		for (let i = 0; i < notVerifys.length; i++) {
			data += shownotverify(notVerifys[i])
		}
		alertNotification.innerHTML = data;
		acepetinvitation()
		declineinvitation()
	})
}
verifytrueorfalse()
function shownotverify(notVerifys) {
	let alertData = `
		<div id="${notVerifys.chanelId}">
		<h4 style="color:black">${notVerifys.member} want to add you in new  ${notVerifys.chanelName} chanel.</h4>
		<p>if you want to add the click on acepet button othetwise click on Decline button</p>
		<button id="${notVerifys.chanelId}"class="btn btn-success acepet">Acepet</button> <button id="${notVerifys.chanelId}"class="btn btn-danger decline">Decline</button>
		</div>
	`
	return alertData
}
/**************** Get total chanel************************** */
let request = new XMLHttpRequest();
let htmlSection = ""
request.open("get", `/totalchanel`);
request.send();
request.addEventListener("load", () => {
	let html = ""
	let chanelInJson = JSON.parse(request.responseText)
	let products = chanelInJson.chanel
	for (let i = 0; i < products.length; i++) {
		if (products[i].confirm === true && products[i].creator === false) {
			html += notcreatorChenel(products[i])
			chanel.innerHTML = html
		}
		if (products[i].confirm === false || products[i].creator === false)
			continue;
		html += addChenel(products[i])
	}
	chanel.innerHTML = html
	chanelButtonInLeftPanel = document.querySelectorAll(".chanelInLeftPanel");
	addChanelInRightPAnel()
	let message = document.querySelectorAll(".message");
	messagePage();
	deleteChanel();
})

function addChenel(product) {
	let allChanel = `
			<p id="${product.chanelId}">
			  <button id="${product.chanelId}"class="chanelInLeftPanel" name="${product.chanelName}"style="background-color:white;border:none;font-weight: bold;">#${product.chanelName}</button> 
			  <button id="${product.chanelId}"style="font-size:25px;background-color:white"class="span delete"style="background-color:white;">🗑</button>
			</p>
`
	return allChanel
}
function notcreatorChenel(product) {
	let allnotcreatedChanel = `
				<p >
			  <button id="${product.chanelId}"class="chanelInLeftPanel" name="${product.chanelName}"style="background-color:white;border:none;font-weight: bold;">#${product.chanelName}</button> 
			 </p>
`
	return allnotcreatedChanel
}


/************************** Add chanel in rightpanel ************************************ */
let htmlPost = "";
let deleteposts;
function addChanelInRightPAnel() {
	let chanelButtonInLeftPanel = document.querySelectorAll(".chanelInLeftPanel");
	chanelButtonInLeftPanel.forEach(btn => {
		btn.onclick = function (event) {
			chanelIds = event.target.id
			console.log(chanelIds, "hm ynha se hai")
			deletePosts = event.target.name
			rightChanelPanel.innerHTML = ""
			let allPost = "";
			let allChanel = `
			<h2 style="text-align:center;font-weight:bold;color:blue">
				${event.target.name}  
			</h2>
	`
			rightChanelPanel.innerHTML = allChanel
			let request = new XMLHttpRequest();
			request.open("get", `/totalpost/${event.target.id}`)
			request.send();
			postDiv.innerHTML = ""
			request.addEventListener("load", () => {
				let postInJson = JSON.parse(request.responseText)
				let post = postInJson.postData
				for (let i = 0; i < post.length; i++) {
					allPost += addPostInRightPanel(post[i]);
				}
				postDiv.innerHTML = allPost;
				let message = document.querySelectorAll(".message");
				messagePage();
				chanelPost();

			})
		}
	})
}
/********************** Find post *************************** */
function chanelPost() {
	let request = new XMLHttpRequest();
	request.open("get", `/findPost/${chanelIds}`)
	request.send();
	request.addEventListener("load", () => {
		let status = request.status
		if (status === 200) {
			console.log("request with 200")
		}
		else {
			console.log("Anything Bad, please check")
		}
	})

}


function addPostInRightPanel(post) {
	htmlPost = `
			
					<h3>
					<button class="message" id="${post.createTime}"style="max-width:500px; text-align:center;color:Black;border:none;background:lightmint;flex-wrap:wrap;border-radius:10px">${post.postName}
						<p style="font-size:15px;color:black;text-align:right">Creater:-${post.username}</p>
						<p style="font-size:10px;color:black;text-align:right">Created:-${post.createTime}</p></button>
					</h3>
					
			`
	return htmlPost;
}


function acepetinvitation() {
	let verifychanel;
	let acepetButton = document.querySelectorAll(".acepet")
	acepetButton.forEach(btn => {
		btn.onclick = function (event) {
			let notificationInScreen = document.getElementById(event.target.id)
			let chanelToBeAdd = document.getElementById("append")
			let request = new XMLHttpRequest();
			request.open("get", `/acepetinvite/${event.target.id}`);
			request.send();
			request.addEventListener("load", () => {
				let verifychanelInJson = JSON.parse(request.responseText)
				let chanels = verifychanelInJson.chanel
				for (let i = 0; i < chanels.length; i++) {
					alertNotification.removeChild(notificationInScreen);
					//chanel.appendChild(chanelToBeAdd)
				}
			})
		}
	})

}
acepetinvitation()

function declineinvitation() {
	let declineButon = document.querySelectorAll(".decline");
	declineButon.forEach(btn => {
		btn.onclick = function (event) {
			let notificationInScreen = document.getElementById(event.target.id)
			let request = new XMLHttpRequest();
			console.log(`del${event.target.id}`)
			request.open("get", `deleteinvite/${event.target.id}`)
			request.send()
			request.addEventListener("load", () => {
				let verifychanelInJson = JSON.parse(request.responseText)
				let chanels = verifychanelInJson.chanel
				alertNotification.removeChild(notificationInScreen);
				//chanel.appendChild(chanelToBeAdd)
			})
		}
	})
}
declineinvitation();



function messagePage() {
	addChanelInRightPAnel()
	let message = document.querySelectorAll(".message");
	message.forEach(btn => {
		btn.onclick = function (event) {
			console.log(event.target.id)
			let request = new XMLHttpRequest();
			request.open("get", `/message/${event.target.id}`)
			request.send();
			request.addEventListener("load", () => {
				let status = request.status
				if (status === 202) {
					location.href = "http://localhost:5000/message"
				}
				else {
					console.log("kuch glti hua hai av v")
				}
			})
		}
	})
}
messagePage();




function addmember() {
	member.addEventListener("click", () => {
		let request = new XMLHttpRequest();
		console.log(chanelIds)
		request.open("get", `/addmember/${chanelIds}`)
		request.send();
		request.addEventListener("load", () => {
			let status = request.status
			if (status === 200) {
				console.log("hello")
			}
			else {
				console.log("kuch glti hua hai")
			}
		})

	})

}
addmember();
/****************** Delete chanel Complete *************************** */
function deleteChanel() {
	let deleteButton = document.querySelectorAll(".delete");
	deleteButton.forEach(btn => {
		btn.addEventListener("click", (event) => {
			let request = new XMLHttpRequest();
			console.log(event.target.id)
			console.log("hello")
			request.open("get", `/delete/${event.target.id}`)
			request.send();
			request.addEventListener("load", () => {
				let status = request.status
				if (status === 200) {
					let chanelToBeDeleted = document.getElementById(event.target.id)
					chanel.removeChild(chanelToBeDeleted)
					rightChanelPanel.innerHTML = ""
					postDiv.innerHTML = ""
					deletePost();
				}
				else {
					console.log("kuch glti hua hai")
				}
			})
		})
	})
}


/********************** Delete Post complete************************************** */
function deletePost() {
	let request = new XMLHttpRequest();
	request.open("get", `/deletepost/${deletePosts}`)
	request.send();
	request.addEventListener("load", () => {
		let status = request.status
		if (status === 200) {
			console.log("nice")
		}
		else {
			console.log("kuch glti hua hai av v")
		}
	})


}


let modalBtns = [...document.querySelectorAll(".button")];
modalBtns.forEach(function (btn) {
	btn.onclick = function () {
		let modal = btn.getAttribute("data-modal");
		document.getElementById(modal).style.display = "block";
	};
});
let closeBtns = [...document.querySelectorAll(".close")];
closeBtns.forEach(function (btn) {
	btn.onclick = function () {
		let modal = btn.closest(".modal");
		modal.style.display = "none";
	};
});
window.onclick = function (event) {
	if (event.target.className === "modal") {
		event.target.style.display = "none";
	}
};
