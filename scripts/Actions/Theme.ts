import AnimeNotifier from "../AnimeNotifier"

let currentThemeName = "light"
let previewTimeoutID: number = 0
// let themeWheel: HTMLElement
// let themeWheelTimeoutID: number = 0

const themes = {
	"light": {},
	"dark": {
		"link-color-h": "45",
		"link-color-s": "100%",
		"link-color-l": "66%",
		"link-hover-color-l": "76%",

		"text-color-l": "90%",
		"bg-color-l": "18%",
		"bg-color-s": "0%",
		"ui-background-l": "14%",

		"link-hover-text-shadow": "0 0 8px hsla(var(--link-color-h), var(--link-color-s), var(--link-color-l), 0.5)",
		"reverse-light-color": "rgba(255, 255, 255, 0.1)",
		"reverse-light-hover-color": "rgba(255, 255, 255, 0.2)",
		"sidebar-background": "hsla(0, 0%, 0%, 0.2)",
		"sidebar-opaque-background": "hsl(0, 0%, 18%)",
		"table-row-hover-background": "hsla(0, 0%, 100%, 0.01)",

		"theme-white": "var(--bg-color)",
		"theme-black": "var(--text-color)",

		"link-active-color": "var(--link-hover-color)",
		"button-hover-color": "var(--link-hover-color)",
		"button-hover-background": "hsl(var(--bg-color-h), var(--bg-color-s), 10%)",
		"tab-background": "hsla(0, 0%, 0%, 0.1)",
		"tab-hover-background": "hsla(0, 0%, 0%, 0.2)",
		"tab-active-color": "hsl(0, 0%, 95%)",
		"tab-active-background": "hsla(0, 0%, 2%, 0.5)",
		"loading-anim-color": "var(--link-color)",
		"anime-alternative-title-color": "hsla(0, 0%, 100%, 0.5)",
		"anime-list-item-name-color": "var(--text-color)",
		"tip-bg-color": "hsl(0, 0%, 10%)",
		// "tip-bg-color": "hsl(var(--bg-color-h), var(--bg-color-s), 10%)",

		"like-color": "var(--link-color)",
		"unlike-color": "var(--link-color)",
		"permalink-color": "var(--link-color)",

		"quote-color": "var(--text-color)",

		"calendar-hover-color": "var(--reverse-light-color)"
	}
	// "crimson": {
	// 	"base-theme": "dark",
	// 	"link-color-h": "0",
	// 	"link-color-l": "78%",
	// 	"link-hover-color-l": "88%",
	// 	"bg-color-s": "70%"
	// },
	// "sakura": {
	// 	"base-theme": "light",
	// 	"link-color-h": "348",
	// 	"link-color-s": "100%",
	// 	"link-color-l": "53%",
	// 	"link-hover-color-l": "58%",
	// 	"bg-color-h": "348",
	// 	"bg-color-s": "100%",
	// 	"bg-color-l": "86%",
	// 	"ui-background-l": "91%",
	// 	"tab-active-color": "var(--text-color)",
	// 	"tab-active-background": "hsla(0, 0%, 98%, 0.25)",
	// 	"button-hover-background": "hsl(var(--bg-color-h), var(--bg-color-s), 53%)"
	// }
}

// Next theme
export function nextTheme(arn: AnimeNotifier) {
	// if(!themeWheel) {
	// 	themeWheel = document.createElement("div")
	// 	themeWheel.classList.add("theme-wheel")
	// 	themeWheel.classList.add("fade")
	// 	themeWheel.classList.add("fade-out")
	// 	document.body.appendChild(themeWheel)
	// }

	// // Show theme wheel
	// themeWheel.classList.remove("fade-out")

	// // Clear theme wheel timeout
	// clearTimeout(themeWheelTimeoutID)

	// themeWheelTimeoutID = setTimeout(() => {
	// 	// Hide theme wheel
	// 	themeWheel.classList.add("fade-out")
	// }, 2000)

	// Sort themes by name
	const themesSorted = [
		"light",
		"dark"
		// "crimson",
		// "sakura"
	]

	// Find current index and apply theme of next index
	for(let i = 0; i < themesSorted.length; i++) {
		if(themesSorted[i] === currentThemeName) {
			let newIndex = (i + 1) % themesSorted.length
			applyTheme(themesSorted[newIndex])
			break
		}
	}

	// Clear preview timeout
	clearTimeout(previewTimeoutID)

	// Show preview message
	if(currentThemeName !== "light" && (!arn.user || arn.user.dataset.pro !== "true")) {
		arn.statusMessage.showInfo(`Previewing "${currentThemeName}" theme for 30 seconds. If you would like to use it permanently, please support us.`, 5000)

		// After 30 seconds, switch back to default theme if the user doesn't own a PRO account
		previewTimeoutID = setTimeout(() => {
			if(currentThemeName !== "light") {
				applyTheme("light")
				arn.statusMessage.showInfo("Theme preview time has ended. If you would like to use it permanently, please support us.", 5000)
			}
		}, 30000)
	}
}

// Apply theme
export function applyTheme(themeName: string) {
	let root = document.documentElement
	let theme = themes[themeName]

	// Apply base theme
	if(theme["base-theme"]) {
		applyTheme(theme["base-theme"])
	}

	for(let property in theme) {
		if(!theme.hasOwnProperty(property)) {
			continue
		}

		if(property === "base-theme") {
			continue
		}

		if(themes.light[property] === undefined) {
			themes.light[property] = root.style.getPropertyValue(`--${property}`)
		}

		root.style.setProperty(`--${property}`, theme[property])
	}

	currentThemeName = themeName
}