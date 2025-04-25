"use strict"

const welcomeScreen = document.getElementById('welcome-screen')
const startBtn = document.getElementById('start-button')
const gameField = document.getElementById('game-screen')
const scoreBoard = document.getElementById('score')
const overlay = document.getElementById('overlay')

class Donya {
	constructor(imageObj, maxStep, maxSpeed, cssObj, level = 1) {
		this.imageObj = imageObj
		this.maxStep = maxStep
		this.maxSpeed = maxSpeed
		this.cssObj = cssObj
		this.hits = 0
		this.attempts = 4
		this.level = level
	}
	getRandomValue(minValue, maxValue) {
		return (
			minValue + Math.floor(Math.random() * (maxValue - minValue + 1))
		)
	}
	setInitDirection() {
		this.vx = this.getRandomValue(-this.maxStep, this.maxStep)
		this.vy = this.getRandomValue(-this.maxStep, this.maxStep)
	}
	updateCoordinates() {

		this.left += this.vx
		if (this.left < 0 || this.left > 90) this.vx = -this.vx

		this.top += this.vy
		if (this.top < 0 || this.top > 90) this.vy = -this.vy
	}
	setCursor() {
		const cursor = document.createElement('div')
		cursor.classList.add('cursor')
		gameField.appendChild(cursor)

		document.addEventListener('mousemove', (e) => {
			cursor.style.left = `${e.pageX}px`
			cursor.style.top = `${e.pageY}px`
		})
	}
	updateHits() {
		const hitsSpan = document.getElementById('hits')
		const attemptsSpan = document.getElementById('attempts')
		const levelSpan = document.getElementById('level')

		hitsSpan.innerText = this.hits
		attemptsSpan.innerText = this.attempts
		levelSpan.innerText = this.level
	}
	move() {
		this.updateCoordinates()
		this.setDonyaPosition()
	}
	setInitPositionCoordinates() {
		this.left = this.getRandomValue(0, 100)
		this.top = this.getRandomValue(0, 100)
	}
	setDonyaPosition() {
		this.donya.style.top = this.top + '%'
		this.donya.style.left = this.left + '%'
	}
	setInitDonyaPosition() {
		this.setInitPositionCoordinates()
		this.setDonyaPosition()
	}
	renderMessageButton() {
		const messageBtn = document.createElement('button')
		messageBtn.className = "button"
		messageBtn.style.marginBlockStart = '15px'

		return messageBtn
	}
	renderMessage() {
		const messageDiv = document.createElement('div')
		messageDiv.style.padding = "20px"
		messageDiv.style.position = 'fixed'
		messageDiv.style.top = "50%"
		messageDiv.style.left = "50%"
		messageDiv.style.transform = "translate(-50%, -50%)"
		messageDiv.style.zIndex = "1000"
		messageDiv.style.backgroundColor = 'orange'

		return messageDiv
	}
	winLevel() {
		const congratsDiv = this.renderMessage()
		congratsDiv.innerText = "🎉 Ти зловив/ла Доню 9 разів! Переходимо на наступний рівень!"
		clearInterval(this.interval)

		const nextLevelBtn = this.renderMessageButton()
		nextLevelBtn.innerText = 'Старт!'

		congratsDiv.append(nextLevelBtn)

		gameField.append(congratsDiv)
		overlay.style.display = "block"
		this.maxSpeed *= 0.9

		if (this.level >= 4) {
			congratsDiv.innerText = 'Вітаю. ♠️♥️♦️♣️ Ви допомогли пану Зеленському здобути всі гральні карти!'
			nextLevelBtn.remove()
			congratsDiv.append(this.showWictoryVideo())
		}

		nextLevelBtn.onclick = () => {
			gameField.innerHTML = ''
			this.setCursor()
			overlay.style.display = "none"
			this.level = this.level + 1
			startGame(this.level, this.maxSpeed)
		}
	}
	failLevel() {
		const failDiv = this.renderMessage()
		failDiv.innerText = "😢 Спроби закінчились. Спробуй ще раз!"

		const beginAgainBtn = this.renderMessageButton()
		beginAgainBtn.innerText = 'Старт!'

		failDiv.append(beginAgainBtn)

		gameField.append(failDiv)
		overlay.style.display = "block"

		beginAgainBtn.onclick = () => {
			gameField.innerHTML = ''
			this.setCursor()
			overlay.style.display = "none"
			startGame(this.level, this.maxSpeed)
		}
	}
	onTap() {
		clearInterval(this.interval)
		this.donya.src = this.imageObj.after

		this.hits++
		this.updateHits()

		if (this.hits >= 9) {
			this.winLevel()
			return
		}

		setTimeout(() => {
			this.donya.src = this.imageObj.before
			this.interval = setInterval(() => this.move(), this.maxSpeed)
		}, 1000);
	}
	showWictoryVideo() {
		const video = document.createElement('video')
		video.style.marginBlockStart = "35px"
		video.style.display = "block"
		video.src = 'video/video.mp4'
		video.controls = true
		video.autoplay = true
		video.style.width = "100%"
		video.style.aspectRatio = "1920 / 1080"

		return video
	}
	render(containerSelector) {
		const img = document.createElement('img')
		img.src = this.imageObj.before
		img.className = this.cssObj.containerClass
		this.donya = img
		this.donya.onclick = this.onTap.bind(this)
		this.setInitDonyaPosition()
		this.setInitDirection()
		this.interval = setInterval(() => this.move(), this.maxSpeed)

		if (containerSelector) {
			document.querySelector(containerSelector).append(img)
		}
	}
}

let activeDonya = null
let isStartGame = false

function startGame(level = 1, maxSpeed = 100) {

	const imageObj = {
		before: 'img/tramp.jpg',
		after: 'img/tramp_after.png'
	}
	activeDonya = new Donya(
		imageObj,
		Math.random() * 3,
		maxSpeed,
		{
			containerClass: 'image',
		},
		level
	)
	activeDonya.render('#game-screen')
}


startBtn.addEventListener('click', () => {

	gameField.style.cursor = 'url("../img/cursor.png") 16 16, auto'

	welcomeScreen.style.display = "none"
	gameField.style.display = "block"
	scoreBoard.style.display = 'block'

	startGame()
	activeDonya.setCursor()
	isStartGame = true
})

document.body.addEventListener('click', (e) => {
	if (activeDonya && isStartGame && overlay.style.display !== "block" && !e.target.classList.contains('image')) {
		activeDonya.attempts--
		activeDonya.updateHits()

		if (activeDonya.attempts <= 0) {
			activeDonya.failLevel()
		}
	}
})
