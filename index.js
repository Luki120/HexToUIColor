document.querySelector('.input-field').addEventListener('input', () => {
	const websiteDescription = document.querySelector('.website-description')
	const websiteExtendedDescription = document.querySelector('.website-extended-description')
	const languageBlocksContainer = document.querySelector('.language-blocks-container')

	const hexColor = document.querySelector('.input-field').value.slice(0, 8)
	const colorFormats = hexToColorFormats(hexColor)

	document.querySelector('.input-field').value = hexColor

	const githubRibbon = document.querySelector('.github-ribbon')
	githubRibbon.style.fill = '#00000080'

	if (hexColor.trim() === '') {
		githubRibbon.style.color = 'white'
		githubRibbon.style.fill = '#4A5899'
	}
	else if (hexColor.trim() === '#000000' || hexColor.trim() === '000000' || hexColor.trim() === '00000000')
		githubRibbon.style.fill = '#4A5899'

	document.querySelector('.objc-container #objc-content').innerHTML = colorFormats.uiColorObjC
	document.querySelector('.swift-container #swift-content').innerHTML = colorFormats.uiColorSwift
	document.querySelector('.swiftui-container #swiftui-content').innerHTML = colorFormats.colorSwiftUI

	if (hexColor.length >= 3) {
		document.body.style.backgroundColor = `#${hexColor}`
		githubRibbon.style.color = `#${hexColor}`

		if (hexColor.trim() === '#000000' || hexColor.trim() === '000000' || hexColor.trim() === '00000000') {
			websiteDescription.style.color = 'white'
			websiteExtendedDescription.style.color = 'white'
		}
		else {
			websiteDescription.style.color = 'black'
			websiteExtendedDescription.style.color = 'black'
		}
		languageBlocksContainer.classList.add('fade-in-container')
		languageBlocksContainer.classList.remove('fade-out-container')
	}
	else {
		document.body.style.backgroundColor = 'white'
		languageBlocksContainer.classList.add('fade-out-container')
		languageBlocksContainer.classList.remove('fade-in-container')
	}
});

/**
 * Converts a hex color code to various color formats.
 * @param {string} hex - The hex color code.
 * @returns {Object} An object with color format strings.
 * @property {string} colorSwiftUI - SwiftUI color format string.
 * @property {string} uiColorSwift - UIKit (Swift) color format string.
 * @property {string} uiColorObjC - Objective-C color format string.
 */
function hexToColorFormats(hex) {
	hex = hex.replace(/^#/, '');

	const rHex = hex.slice(0, 2)
	const gHex = hex.slice(2, 4)
	const bHex = hex.slice(4, 6)
	const aHex = hex.length === 8 ? hex.slice(6, 8) : 'FF'

	const [r, g, b, a] = [rHex, gHex, bHex, aHex].map((value, i) => {
		const decimal = parseInt(value, 16);
		const normalized = (decimal / 255).toFixed(2);
		return normalized === '1.00' ? '1.0' : normalized
	});

	const colorSwiftUI = `Color(red: ${r}, green: ${g}, blue: ${b}, opacity: ${a})`
	const uiColorSwift = `UIColor(red: ${r}, green: ${g}, blue: ${b}, alpha: ${a})`
	const uiColorObjC = `[UIColor colorWithRed:${r} green:${g} blue:${b} alpha:${a}];`

	return {
		colorSwiftUI,
		uiColorSwift,
		uiColorObjC
	};
}

async function copyText(paragraphId) {
	try {
		await navigator.clipboard.writeText(document.getElementById(paragraphId).textContent)
		alert('Color copied to clipboard!')
	}
	catch {
		console.error('Failed to copy text: ', error)
	}
}

function openGitHubURL() {
	window.open('https://github.com/Luki120/HexToUIColor/', '_blank')
}
