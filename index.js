let isSwitchModeButtonClicked = false

const githubRibbon = document.querySelector('.github-ribbon')
const inputField = document.querySelector('.input-field')
const hexContainer = document.querySelector('.hex-container')
const languageBlocksContainer = document.querySelector('.language-blocks-container')

document.querySelector('.input-field').addEventListener('input', () => {
	const websiteDescription = document.querySelector('.website-description')
	const websiteExtendedDescription = document.querySelector('.website-extended-description')
	const hexUIColorContainer = document.querySelector('.hex-uicolor-container')

	githubRibbon.style.fill = '#00000080'

	if (inputField.value.trim().length === 0) {
		document.body.style.backgroundColor = 'white'
		githubRibbon.style.color = 'white'
		githubRibbon.style.fill = '#4A5899'
	}

	let hexColor

	if (isSwitchModeButtonClicked) {
		if (inputField.value.length === 0 || (!inputField.value.includes('UIColor') && !inputField.value.includes('Color'))) {
			hexContainer.classList.remove('fade-in-container')

			setTimeout(() => {
				hexContainer.classList.remove('fade-in-hex-container')
			}, 550)

			return
		}

		const uiColorString = inputField.value
		hexColor = uiColorToHex(uiColorString)

		hexContainer.classList.add('fade-in-hex-container')

		setTimeout(() => {
			hexContainer.classList.add('fade-in-container')
		}, 300)

		document.querySelector('#hex-content').innerHTML = `${hexColor}`
	}

	else {
		hexColor = inputField.value.startsWith('#') ? inputField.value.slice(0, 9) : inputField.value.slice(0, 8)
		const colorFormats = hexToColorFormats(hexColor)

		inputField.value = hexColor

		if (inputField.value.length === 0 || !isValidHexColor(inputField.value)) {
			languageBlocksContainer.classList.remove('fade-in-container')
			return
		}

		languageBlocksContainer.classList.add('fade-in-container')

		document.querySelector('#objc-content').innerHTML = colorFormats.uiColorObjC
		document.querySelector('#swift-content').innerHTML = colorFormats.uiColorSwift
		document.querySelector('#swiftui-content').innerHTML = colorFormats.colorSwiftUI
	}

	if (hexColor.trim().length < 3) return

	document.body.style.backgroundColor = hexColor.includes('#') ? `${hexColor}` : `#${hexColor}`
	githubRibbon.style.color = hexColor.includes('#') ? `${hexColor}` : `#${hexColor}`

	const isBlack = ['#000000', '000000', '#000000FF', '000000FF'].includes(hexColor.trim())
	const elements = [hexUIColorContainer, websiteDescription, websiteExtendedDescription]

	elements.forEach(element => {
		isBlack ? element.classList.add('dark-colors') : element.classList.remove('dark-colors')
	})
})

document.querySelector('.switch-mode-button').addEventListener('click', () => {
	const arrow = document.querySelector('.arrow')
	const hexUIColorText = document.querySelector('h3')

	isSwitchModeButtonClicked = !isSwitchModeButtonClicked

	if (isSwitchModeButtonClicked) {
		arrow.classList.add('arrow-rotation')
		hexUIColorText.classList.add('content-transition')
		inputField.classList.add('content-transition')
		inputField.value = ''

		setTimeout(() => {
			inputField.style.fontSize = '0.8rem'
		}, 300)

		languageBlocksContainer.classList.remove('fade-in-container')
		if (inputField.value.trim().length === 0) return

		hexContainer.classList.add('fade-in-container', 'fade-in-hex-container')
	}

	else {
		arrow.classList.remove('arrow-rotation')
		hexUIColorText.classList.remove('content-transition')
		inputField.classList.remove('content-transition')
		inputField.style.fontSize = '1rem'
		inputField.value = ''

		hexContainer.classList.remove('fade-in-container')

		setTimeout(() => {
			hexContainer.classList.remove('fade-in-hex-container')
		}, 550)

		if (!isValidHexColor(inputField.value)) {
			languageBlocksContainer.classList.remove('fade-in-container')
			return
		}

		languageBlocksContainer.classList.add('fade-in-container')
	}

	document.body.style.backgroundColor = hexColor.includes('#') ? `${hexColor}` : `#${hexColor}`
	githubRibbon.style.color = hexColor.includes('#') ? `${hexColor}` : `#${hexColor}`
})

document.addEventListener('DOMContentLoaded', () => {
	const currentYear = new Date().getFullYear()
	document.querySelector('.copyright-year').textContent = `© 2024-${currentYear} Luki120`
})

/**
 * Function to check wether a given input is a valid hex color
 * @param {string} input - The input string to validate
 * @returns {boolean} A boolean value that indicates if it's a valid hex color
 */
function isValidHexColor(input) {
	const hexPattern = /^(#?([0-9A-Fa-f]{6})([0-9A-Fa-f]{2})?)$/
	return hexPattern.test(input)
}

/**
 * Converts a `Color` / `UIColor` string in `rgb()` or `rgba()` format to a hex color string
 * @param {string} uiColor - The `Color` / `UIColor` string to convert
 * @returns {string} The hex color string, either in `#RRGGBB` / `#RRGGBBAA` format, prefixed with `#`
 */
function uiColorToHex(uiColor) {
	const regex = /\d*\.?\d+/g
	const rgba = uiColor.match(regex).map(Number)

	if (rgba.length < 3) return '#FFFFFF'

	const r = Math.round(rgba[0] * 255)
	const g = Math.round(rgba[1] * 255)
	const b = Math.round(rgba[2] * 255)
	const a = rgba.length === 4 ? Math.round(rgba[3] * 255) : 255

	return `#${[r, g, b, a].map(value => value.toString(16).padStart(2, '0').toUpperCase()).join('')}`
}

/**
 * Converts a hex color code to `Color` / `UIColor` formats
 * @param {string} hex - The hex color code.
 * @returns {Object} An object with color format strings.
 * @property {string} colorSwiftUI - SwiftUI color format string.
 * @property {string} uiColorSwift - UIKit (Swift) color format string.
 * @property {string} uiColorObjC - Objective-C color format string.
 */
function hexToColorFormats(hex) {
	hex = hex.replace(/^#/, '')

	const rHex = hex.slice(0, 2)
	const gHex = hex.slice(2, 4)
	const bHex = hex.slice(4, 6)
	const aHex = hex.length === 8 ? hex.slice(6, 8) : 'FF'

	const [r, g, b, a] = [rHex, gHex, bHex, aHex].map((value) => {
		const decimal = parseInt(value, 16)
		const normalized = (decimal / 255).toFixed(2)
		return normalized === '1.00' ? '1.0' : normalized
	})

	const colorSwiftUI = `Color(red: ${r}, green: ${g}, blue: ${b}, opacity: ${a})`
	const uiColorSwift = `UIColor(red: ${r}, green: ${g}, blue: ${b}, alpha: ${a})`
	const uiColorObjC = `[UIColor colorWithRed:${r} green:${g} blue:${b} alpha:${a}];`

	return { colorSwiftUI, uiColorSwift, uiColorObjC }
}

async function copyColor(paragraphId) {
	try {
		await navigator.clipboard.writeText(document.getElementById(paragraphId).textContent)

		const copiedCodeToast = document.querySelector('.copied-code-toast')
		copiedCodeToast.classList.add('fade-in')

		setTimeout(() => {
			copiedCodeToast.classList.remove('fade-in')
		}, 2500)
	}
	catch {
		console.error('Failed to copy color: ', error)
	}
}

function openGitHubURL() {
	window.open('https://github.com/Luki120/HexToUIColor/', '_blank')
}
