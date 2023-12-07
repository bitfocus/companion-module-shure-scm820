import Image from './vendor/companion/Image.js'

/**
 * Companion instance icons class for Shure SCM820.
 * Utilized to generate/recall the icons for realtime monitoring.
 *
 * @since 1.1.0
 * @author Keith Rocheck <keith.rocheck@gmail.com>
 */
export default class Icons {
	/**
	 * Create an instance of a Shure icons module.
	 *
	 * @param {instance} instance - the parent instance
	 * @since 1.0.0
	 */
	constructor(instance) {
		this.instance = instance

		this.savedIcons = {}

		this.AUDIO = {
			0: Buffer.from(
				'iVBORw0KGgoAAAANSUhEUgAAAAQAAAAqCAYAAACUV/o4AAABH0lEQVQoka3SvSvFURzH8df1UIjFw2K9iYhFESN1FxFZDFiEIjH7B5SB3Wq6JnnYDMpdRFLKokxkJ6z61rn8uKtTZ/h9en/f53NOv1yhUFjALp4wVZ3P5y/QiDbUVuHSz7qpwTim8YKzCD6wX2aq0uwm5uI7iBMMJKAliK6MtCOCRTwijt+OkYO0v6W/VgSreMcDuqP6ORrQjLogSpmRUkgnMYHncvCJYvaUFqylC+aCOMZQAjaC6MlIOyNYStVL5erFv9KK6vHqr7gPx3+9ekX1IwwnYD2Ivoy0N4KV9BbX2IqREP6SVlSfTz/LFfJRPa7dinbUB3GbmbgN6Rhm0kmnEcTV97LSJsxiNIIgDjGSgOUgBjPS/gg28IY77HwBh9s9kKLHTIUAAAAASUVORK5CYII=',
				'base64'
			),
			1: Buffer.from(
				'iVBORw0KGgoAAAANSUhEUgAAAAQAAAAqCAYAAACUV/o4AAABJElEQVQoka3SvytFYRzH8ZdfhVj8WKw3EbEoYlV3EZHFgMWPgcTsH1AWu9XE6MdGKXcRSQaLMpFdYTz65rkc7uo5neF8en/fz+d5OlXFYnEBO3jCVE2hULhAE9pRV41LP+umFuOYxgtOI3jHXpmpTrObmIvvII4xmIDWILpz0s4IlvCI2H47Rg7S+y39tSJYxRse0BPVz9GIFtQHUcqNlEI6iQk8l4MP7Od3acVaOmBVEEcYTsBGEL05aVcEy6l6qVx9/6+0onrc+ivuw/Fft15R/RAjCVgPoj8n7YtgJd3FNbZiJIS/pBXV59PPcoVCVI9jt6EDDUHc5iZuQzqGmbTTSQRx9N0fKNMsMyszKvsKzmTfz3JIh3LSgSAWZV5l7mS6PgGMikrPua7+EAAAAABJRU5ErkJggg==',
				'base64'
			),
			2: Buffer.from(
				'iVBORw0KGgoAAAANSUhEUgAAAAQAAAAqCAYAAACUV/o4AAABJElEQVQoka3SMS9kURjG8d9YEhEUJvsJJkLIaiSEdpNphNhodzWYggi1L7CJRq9VjRIlicQ0siKi2GYTFdETtjzyxpnZu0bp3NziPPm///Pck1uqVqtL2MEtvn2qVCpn6MVndHXg3L912YlZLOAexxE8Y6/JdOTZLfyIfRBHmMhAOYjhgnQwghXcII7fjpH9/Lak/60I1vCEPxiJ6qfowQC6g2gURhohnccc7prBX9SLp5Sxnj+wFMQhpjKwGcRoQToUQS1XbzSr199K26rHrT/gdzg+6tbbqh9gOgMbQYwVpF8iWM13cYGfMRLClrQktVdfzD/LL1RIHqXWsxvEVWHiKoh+SU0yE753pX34jq+vUXJSkNaCmCxMjAexLHmQXEuGXgARkE/dp6oXNAAAAABJRU5ErkJggg==',
				'base64'
			),
			3: Buffer.from(
				'iVBORw0KGgoAAAANSUhEUgAAAAQAAAAqCAYAAACUV/o4AAABKUlEQVQoka3SMUtcQRiF4edqBAmaIot/wEtYUUwTUKwD24iSYJtNE90mbEidn5DG3tZq02ppQHAtRJDFwkZIZbBf0ZQjH9xdRzelc5niHt7vnDPDFI1G4wu2cYWP42VZHmEKM5gYw4mHdfYCa9jANQ5CuMPugBmrZn+gGf9B7GOpAmpBzGWmb0LYwh9E/M8Y+VXtoemjFcJX3OIS81H9EC/xGpNBdLORbph+wDr+DoR/6OQpNbSrAxZB7GGlAr4HsZCZ1kNoVdW7g+qdp6Yj1ePW+7gIj+e4dZKapC3ZkBQhHEvD71uYvs1MF4NoSq4kp5LZQhptOiJ8rh7LKcrwuMlSdoLoZRO9IF5JWpLVCPhvyjQ+4f3gLL8z01YQy9nEuyA2JX3JuaR+D/oCW+MvbGkzAAAAAElFTkSuQmCC',
				'base64'
			),
			4: Buffer.from(
				'iVBORw0KGgoAAAANSUhEUgAAAAQAAAAqCAYAAACUV/o4AAABLElEQVQokXXSPy9kURjH8c/4k4igIN6AidgQGsmKmkwjhGjZZplGiNpL0Gg3225FS0kiMQqRyGQLjURF9P6WR564w5Hh3Nzi/PL9fc9zT26pUqn8xg5usNBaLpdP0IV+tLfgzMe6aMMsFnGHwwie8a/BtBTdLSzHPogD/CyAviB+ZNLBCFZxjTh+Oyp7xfsu/bQiWMMTrjAcox+jE73oCKKWVWohncccbhvBC3bzU/qwXnxgKYh9TBbAZhAjmXQogmoxeq0x+m4uLUnNo8et3+MyHCSP0vvzp+nWg+iULEumw/el9NPoUTnNpBtBjGWN0SBCeCM5lwx8KW0KfhU/yznK4XjITvkbRD1r1IPokVQlM9+O3o0lTL1FyVEmrQYxkTXGg1iR3Ev+S4ZeARuPYNvim9rUAAAAAElFTkSuQmCC',
				'base64'
			),
			5: Buffer.from(
				'iVBORw0KGgoAAAANSUhEUgAAAAQAAAAqCAYAAACUV/o4AAABNElEQVQokXXSPS9lURiG4ev4SCaCgvgDTiaE0EiIeuQ0MjITnaDBaYSop9FrtKJVUUxDSSIZCpGITKGRqHz0GMolb+zDkmPWzi7Wk/u515u1d6lSqcxhHdf42Vgul/+gFV1obsCJ93XWhO+YxB32I3jCVo1pKLq/MBP7IPYwXACdQfRm0q8RLOAKcfxaVHaK9036YUWwiH+4RF+MfogWdOBLEEdZ5SikPzCBm1rwjO0aUkqrOjGFW/wOYhejBbAS0v5M2hNBtRg9TlsLx4dVkupHj1u/x0U4SB6lt2ej7taDaJHMSMbC96k0Rl8qvk0pKseZdDmIwawxEEQIryWnku5PpXXBbPGznKIcjofslM0gzrPGeRDtkqpk/L+jt2Ea316j5CCTVoMYyRpDQcxL7iV/JT0v5Atjrl7N7oUAAAAASUVORK5CYII=',
				'base64'
			),
			6: Buffer.from(
				'iVBORw0KGgoAAAANSUhEUgAAAAQAAAAqCAYAAACUV/o4AAABK0lEQVQokXWSvy9DYRiFn1ssTVka/4AbaUNYJMRM7iKkYlUL7iLEbLF3sYrEZGJlZFKDNJHGYJGYKvb6Nb5y+Mrb3Hpv7vCdPOe85365UZIk68AB0AKW++I4vgYKwDAwkANu+Zu7fmARWAFegEsJH8BJh8kF7x5Q1VnEBTAdgKKIsgsdlbAJPAFaX5PlLLzfE9k+XSPLFvAOPAJjInTIB+pYRN1Z6gqtAEvAc0f4BE599SKwHT4wEnEOzAZgV8S4Cy1JSEN1batlmkZYtrpuvQ08KAOMN+z3Oczcuog8RhVjXnk9Q7uqy3LjQndETDrHhAgFtjAaGCM9QzPCWvhZGkCsjFe35UhE0zmaIoYwUoyFf6sPAqvA3I9kXLnQVMSMc0yJ2MBoY9xjlL4ADWNkTEiBhPwAAAAASUVORK5CYII=',
				'base64'
			),
			7: Buffer.from(
				'iVBORw0KGgoAAAANSUhEUgAAAAQAAAAqCAYAAACUV/o4AAABLElEQVQokXXSMU9TURjG8d8tsjTo0vgFuCElGF1INMyaLkSCYQUWpAuR8A3YXViNCZNhcJYRJ8tgSEzD4GLCYgl7URmPeeEWTtNy7nTe/J//ee7JKVqt1gb20MObibIsv2EKjzFZw3d368cDvMYKLnAUg3/4NGCKtHud3cRvHARxiOcV0AjpbCadqVX4GeL49+EYWjVGB1v4i1+Yi0hs6hWwH0QnS3SixzKWcD4YXOFzLm3gXfWDRRBfsFABO0E8yaTNGLSr6p2x1QtptHrceh8/w0HyR7r9PozcehB1yZrkVfjGSoeqR+Q4k24H8SxLPA0ihD3JiWR6rHRksF49lhOU4bjMTvkYRDdLdIN4JGlLFu+t/hCreHkzSr5m0nYQL7LEfBBvJX3JqaT5H33XZYdBhu4/AAAAAElFTkSuQmCC',
				'base64'
			),
			10: Buffer.from(
				'iVBORw0KGgoAAAANSUhEUgAAAAQAAAAqCAYAAACUV/o4AAABO0lEQVQokX3Qv0vbURSG8U+iQpW6mLq4BlEsdilU2rFKllIRXBy0S2gFpdT/QnDoLK6lQzqV/tgchGaRigiCi+Ci4q62Ha+ccIPfJNALd3l5znPfcyXqievESWIigttEyne7jH335zCIocRKYi6hlHSeUq1WG8VbnONzP37gWcYqIZ0szIyXM36GX9iKkS/5tk6565FWsI4/OMVUX7Va3cMQRvAgiGZhohnSBczjsh38Q6MoreA9FmOVIL7jeQY2gnhckE5E8C5Xb7arN7qlPdXruMZJOKJ6rP0Q8XMDPb8e0te51BV2I/iLT/+t/g0vMvAhiCcF6XQEa/kvDrAZIyHskPZUf4ML/EY1qsfajzCGwSCOChNHIX2FpfzSzwhi9Z2idBjLmI0giK94mYHVIGYK0qcRbOAGx/h4B4zHSr1YWkXQAAAAAElFTkSuQmCC',
				'base64'
			),
			11: Buffer.from(
				'iVBORw0KGgoAAAANSUhEUgAAAAQAAAAqCAYAAACUV/o4AAABPUlEQVQokX3SsUvVYRTG8Y9XA5NcMhfXS1wpbAmKXJW7iBG0OKiL5aCI/RdBf0G4SoOOppuC0F1CCXFwCVpS3C+a44kjr/rTC56Xd3l4zvd9zuEVzAXt4ChopHAWRLlfa/jppn6loy+YCcYDXeF2dTWbzUF8xF9868EmXhXbQEKHKz1Pa8X+Bz/wJVvWy72s2p1HLoVFnOM3nnXX6/Vd9OExetPRqnS0EvoOb3FyJVxgrQodwBLe5yjp+I43xfApHc8r0EYK8yV66yr62l1oR/Q5tHGUjIyeYz9Cbu5Bx9YTOllCnWI7hX9YvTf6BkaLYTkdLyrQkRQWyi728TlbEngL2hF9FsfYQz2j59hPMISH6TiodBwkdAJT5aWtFHL0lRtT6BemhbH8XynsiOszn9DXFejLdHwQ2sKh0PgPkXZX/GyEUR0AAAAASUVORK5CYII=',
				'base64'
			),
			12: Buffer.from(
				'iVBORw0KGgoAAAANSUhEUgAAAAQAAAAqCAYAAACUV/o4AAABOElEQVQokX3RQUuUURiG4WtGgxisRdIvGGLCyE2g1DaZTRiC22xjzcII/RdBv0DchgtbasuCoNlIEoOL2QhtMtqPlcs33vGMfY7R+Tibh/u9z3POJ1gNBkE/aGXwM4iyN+vY93d9SaIRrAQLgVq4uGrtdvsmnuMbtifxDnMFm07p7crMrXrBv+ITXufI27KHqz52yDB4gV84wsxEs9n8iAZu4GoS3cpEN6VLeIzvo+AUO1XpNF5iOa+SxB7uF2AjiTsVaSuDTqneHVXfGZdeqr6KAfrpyOp57Snky1259OopXSylfuB9Br/x5r/Vd/GgAOtJzFakdzNYK29xgFc5ksJzaS3/9nj1pzjGZzQJJ+L820qiV5noJXFd6AiP0vdP6TU8wcOzKHyoSDtJzFcm7iXxTBgIh0LrDxZ8XQrF1VyNAAAAAElFTkSuQmCC',
				'base64'
			),
			13: Buffer.from(
				'iVBORw0KGgoAAAANSUhEUgAAAAQAAAAqCAYAAACUV/o4AAABOklEQVQokW3RQUvUURTG4WfGAhnKhUNfwEEmjNwESutiNmIIbtWNOZsw/Bx+gmgbLnRby4KgcSGCSAs3QhuN9qPm8siR/+RtxnO5m5ffec977hWsB/3gJGincBlEdT/UceCujpJoBKvB60At/F+1TqfzBBs4w84DfMFchTXT9GnRM12v8F/4ge1s2avubdWHhtwK73CFU8yMtVqt72hgEuNJ9IqOXpou4Q1+D4Rr7JamTWxiOVdJ4jNeVsBWEs8K03YK3Sp6bxB9d9h0JPo6+jhJj4yeaz9CvtzDkVdP08Uq1B98TeEvPt1BoSlsCstCLYV98e+8T9PZwvR5EqvCuXAoTNXyc4eTjghrOMchWulxUUz5mMRx0XGcxITQFRZywL1THmMFrwa7fCtMu0nMFx0vkngr9IWfQvsG/u5pEONyWCsAAAAASUVORK5CYII=',
				'base64'
			),
			14: Buffer.from(
				'iVBORw0KGgoAAAANSUhEUgAAAAQAAAAqCAYAAACUV/o4AAABKklEQVQokXXQMWuTURTG8V+igwTqYOkXMEhKxS5CS+eWLIIIrqZL2yyi9HP4CcS9Q7q2a6HQOJRCKQ5ZhC7GLxAjHY+c9E29qfG83OXh//zvea9gJxgFg6CVwTiI6nyu49zfuUyiEXSCrUAtzE6t3W4vYQ8/cPAQx1irsMWULhedZ/UKv8YZPmXlsDqTqd+7ZBK8x298x8qDZrN5igae4FES/aLRT+kbvMbPaXCDXildxAe8zV9J4ggbFbCfxPNC2sqgW63en67eK6U1914oKzsYYZAOwljcfXNeXWgIHWErfXOlM6tn5Wsh/ZjEatF4kUQKh8KF8HSu9J9gG0NcoJmOX8UtX5K4KhpXSTwWusKr/66+gHfYvI3CSSHtJrFeNF4msSuMhG9C6w8ge24IIPMKjwAAAABJRU5ErkJggg==',
				'base64'
			),
			15: Buffer.from(
				'iVBORw0KGgoAAAANSUhEUgAAAAQAAAAqCAYAAACUV/o4AAABMElEQVQokXXQsUqcURCG4WdXi7CghZIbcAkbFNMISmplGyEIdiGmUbeRBO/A3iuQ9BZa2GgbCMQUIohY2Ag2ai5gY7CcMOtvPJrNHE4zvN87wwiWg25wHrSycRtE9bfqOPJYJ0k0gqVgLlALT6vWbrdfYhVX2B7EAaYrbDSlr4vMq3qFX+I7NjOyW/1e1Z8N6TXW8BsXGB9oNpvf0MAIXiRxWCQOU7qAd7h5aNxh5wGpxYZRvMdP7CWxj7cVsJ7SiULaykanWj2nbabj6T08u1BGltHFeToIt+Lv63N1oSEsCXPp6yvN1T9hsTdV+FFIPyfxpkhMJpHCa+FYGOsr/afxEdc4RjMdv4opX5I4LRKnSQwLHWH+v6sP4QNm71vhayHtJDFTJKaSWBG6wpnQ+gPo93Dbhk3zoAAAAABJRU5ErkJggg==',
				'base64'
			),
			16: Buffer.from(
				'iVBORw0KGgoAAAANSUhEUgAAAAQAAAAqCAYAAACUV/o4AAABJklEQVQokXXQsUrbURTH8U/EKVCX4AsoJcWii1BxNmQpSKGrukSziOIbuPsEUujoYNd27dR0EKFIhyyCi+kLpBHHI6f9a2+aeC53uIfv73sOV9AJhkE/aGZjFER1T2dw4V/9SKIebAetQC2MV63dbs9jD7c4m8UXvKmwRkpfFZmXMxV+g284ycin6v6pWhyPT8nIPu5wjaUk8lGvgI9J9IpEL6XvsIlfj417nJfSBg7wPqcm8RnrFXCUxOtC2sxGt1o9p51MbFrz3w9lpIMh+ukgjMTTmfLrQl3YFlrpmyodWz0j3wvpYRIrRWI5iRQOhEthYap0orGDAS6xmI7fxZQPSVwViask5oSu8PbZ1V9gCxt/W+FrIe0msVYkVpPYFYbCT6H5ABJPcXk0xsCyAAAAAElFTkSuQmCC',
				'base64'
			),
			17: Buffer.from(
				'iVBORw0KGgoAAAANSUhEUgAAAAQAAAAqCAYAAACUV/o4AAABHUlEQVQokXXQsS6kURjG8d9MVJPQTNyAjYzY2EZC1KuTiESLxu40suIO9K5AJEqFmlZlFCIRUWgkGtzAIMp38/LhDOOcnOJ78n/+5/2OYDXoBldBK4PHIKqzXcepj3WeRCNYDmYDtdC7Bmwaxl/cYm8Ah5iqsGZKx4rOaL3Cb3CMrVps9krrny55CdbwhGuMZyU/GhWwm0SnaHRyjgXM4/4teMZ+KW3iHxbz35I4wEwFbCTxs5C2MmhXo3f6jl7z6YWysoourtJBeBTvu8+rCw1hWZhNX19pz+hZOSmk60n8KhoTSaTwTjgTRvpKvwQruMMZfqTjobhlJ4mLonGRxJDQFua+HX0QS/j9GoWjQtpOYrpoTCbxR+gKl0LrP4H4b9NTQGIlAAAAAElFTkSuQmCC',
				'base64'
			),
		}
		this.DFR = {
			1: Buffer.from(
				'iVBORw0KGgoAAAANSUhEUgAAACUAAAANCAYAAAAuYadYAAAAqklEQVQ4jWP8//8/g6ur63+GQQJ2797NyOji4gJ20PuE9wPuKsEFgmCaiWGQOIgByR0s6BJnos+g8E2WmuCUQ5bHpw8XAOnBpg7DUdgcgszHZxk+fegAmwdhgImgd2gACDkYa0jhA8g+RDcYnxwyIBS1JDuKkGWEQoEYQPXogzmM6o4CGQrD5PiaGIfB5LGpAxeeg6WcYoAWoEwMSCXpQAOYOwZf3bd7NyMAx59UvJV43fIAAAAASUVORK5CYII=',
				'base64'
			),
			2: Buffer.from(
				'iVBORw0KGgoAAAANSUhEUgAAACUAAAANCAYAAAAuYadYAAAAqElEQVQ4jWP8//8/g6ur63+GQQJ2797NyOji4gJ20PuE9wPuKsEFgmCaiWGQOIgByR0s6BJnos+g8E2WmuCUQ5bHpw+fHdjUYTgKm0OQ+fgsw6cPlzg2dUw4baARwOcpGMAaUvgAvqAnFC3EqiPZUYSiD1e0ITuIUGhRPfpgDqMEYA0pYqOBkMNw6SWUU8GF52AppxigBSgTA1JJOtAA5o7BV/ft3s0IAOG+WAzByncwAAAAAElFTkSuQmCC',
				'base64'
			),
		}
		this.GATE = {
			ON: Buffer.from(
				'iVBORw0KGgoAAAANSUhEUgAAAAcAAAAHCAYAAADEUlfTAAAALElEQVQImWN0cXH5z4ADsICI9wnvMaQFFwgyMOHSBQI0kgQ7CGQ5BmBgYAAAaMYFn77EueIAAAAASUVORK5CYII=',
				'base64'
			),
			OFF: Buffer.from(
				'iVBORw0KGgoAAAANSUhEUgAAAAcAAAAHCAYAAADEUlfTAAAALElEQVQImWN0cXH5z4ADsICIe/fuYUgrKSkxMOHSBQI0kgQ7CGQ5BmBgYAAAZ7IFQxStQrMAAAAASUVORK5CYII=',
				'base64'
			),
		}
		this.LIMITER = {
			ON: Buffer.from(
				'iVBORw0KGgoAAAANSUhEUgAAAAcAAAAHCAYAAADEUlfTAAAAKElEQVQImWN0cXH5z4ADsICI3Xv2YEi7urgwMOHSBQI0ksTtWgYGBgCEkAalo1QB7gAAAABJRU5ErkJggg==',
				'base64'
			),
			OFF: Buffer.from(
				'iVBORw0KGgoAAAANSUhEUgAAAAcAAAAHCAYAAADEUlfTAAAALElEQVQImWN0cXH5z4ADsICIe/fuYUgrKSkxMOHSBQI0kgQ7CGQ5BmBgYAAAZ7IFQxStQrMAAAAASUVORK5CYII=',
				'base64'
			),
		}
		this.MUTE = {
			ON: Buffer.from(
				'iVBORw0KGgoAAAANSUhEUgAAAA0AAAANCAYAAABy6+R8AAAACXBIWXMAAAsTAAALEwEAmpwYAAAFEGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDUgNzkuMTY0NTkwLCAyMDIwLzEyLzA5LTExOjU3OjQ0ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjIuMSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIxLTAzLTE4VDAwOjQ5LTA0OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMS0wMy0xOFQwMDo1ODowMS0wNDowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMS0wMy0xOFQwMDo1ODowMS0wNDowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDozNTcwY2Q5MC0xYzg3LTUxNGEtYWE2ZC1lYmRiOTM3YWYyMDEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MzU3MGNkOTAtMWM4Ny01MTRhLWFhNmQtZWJkYjkzN2FmMjAxIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6MzU3MGNkOTAtMWM4Ny01MTRhLWFhNmQtZWJkYjkzN2FmMjAxIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDozNTcwY2Q5MC0xYzg3LTUxNGEtYWE2ZC1lYmRiOTM3YWYyMDEiIHN0RXZ0OndoZW49IjIwMjEtMDMtMThUMDA6NDktMDQ6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMi4xIChXaW5kb3dzKSIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5vb0K2AAAAbUlEQVQokY2QSxKAMAhDXxzvf+W4sF8ElZkuSvMaggwGhE1Svam1eYxHiVDpLx3SEE0wdYhOE/wAAM6W5RZKNLcq4+bUfIYwy1hAcdQCzKAd/AXZ+yJmzgek5TzBMGqdqYPJct4zFY4VtArj3RfEeiceJAL/4wAAAABJRU5ErkJggg==',
				'base64'
			),
			OFF: Buffer.from(
				'iVBORw0KGgoAAAANSUhEUgAAAA0AAAANCAYAAABy6+R8AAAACXBIWXMAAAsTAAALEwEAmpwYAAAFFmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDUgNzkuMTY0NTkwLCAyMDIwLzEyLzA5LTExOjU3OjQ0ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjIuMSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIxLTAzLTE4VDAwOjQ5OjEwLTA0OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMS0wMy0xOFQwMDo1MDoxNi0wNDowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMS0wMy0xOFQwMDo1MDoxNi0wNDowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDphNmNlYzVkOC0zZWQzLTA0NDctOTM3ZS03NDI5MzM2ZTg2ODQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6YTZjZWM1ZDgtM2VkMy0wNDQ3LTkzN2UtNzQyOTMzNmU4Njg0IiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6YTZjZWM1ZDgtM2VkMy0wNDQ3LTkzN2UtNzQyOTMzNmU4Njg0Ij4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDphNmNlYzVkOC0zZWQzLTA0NDctOTM3ZS03NDI5MzM2ZTg2ODQiIHN0RXZ0OndoZW49IjIwMjEtMDMtMThUMDA6NDk6MTAtMDQ6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMi4xIChXaW5kb3dzKSIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5L/IQVAAAAS0lEQVQoka3RQQoAIAwDwVT8/5frSShoVgUDXpShkkZmCjIfo162C7DEoe0EQggkqZuvWOAmIXDomG8IF1dRlHOEVMTzchFSEbb6AaByDBtQJQehAAAAAElFTkSuQmCC',
				'base64'
			),
		}
	}

	/**
	 * Returns the desired channel state object.
	 *
	 * @param {Object} img - the image object to draw on
	 * @param {Object} icon - the icon object
	 * @param {number} xStart - x start
	 * @param {number} yStart - y start
	 * @param {number} width - width
	 * @param {number} height - height
	 * @access protected
	 * @since 1.0.0
	 */
	drawFromPNGdata(img, icon, xStart, yStart, width, height) {
		if (icon !== undefined) {
			try {
				img.drawFromPNGdata(icon, xStart, yStart, width, height)
			} catch (e) {
				return
			}
		}
	}

	/**
	 * Returns the desired channel state icon.
	 *
	 * @param {Object} image - the image raster object
	 * @param {number} audioIn - the channel input bitmap
	 * @param {number} audioOut - the channel direct out bitmap
	 * @param {String} aOn - a automix gate
	 * @param {String} bOn - b automix gate
	 * @param {String} mute - mute state
	 * @param {number} dfr - the current DFR 0|1|2
	 * @returns {String} base64 encoded PNG
	 * @access public
	 * @since 1.0.0
	 */
	getChannelStatus(image, audioIn, audioOut, aOn, bOn, mute, dfr) {
		let out

		if (image && image.width && image.height) {
			let id =
				image.width +
				'x' +
				image.height +
				`Ia${audioIn}` +
				(audioOut !== null ? `b${audioOut}` : '') +
				(aOn !== null ? `c${aOn}` : '') +
				(bOn !== null ? `d${bOn}` : '') +
				`e${mute}` +
				(dfr !== null ? `f${dfr}` : '')

			if (this.savedIcons[id] === undefined) {
				let img = new Image(image.width, image.height)

				if (audioOut !== null) {
					this.drawFromPNGdata(img, this.AUDIO[audioIn], 59, 13, 4, 42)
					this.drawFromPNGdata(img, this.AUDIO[audioOut], 65, 13, 4, 42)
					this.drawFromPNGdata(img, this.MUTE[mute], 44, 41, 13, 13)
				} else {
					this.drawFromPNGdata(img, this.AUDIO[audioIn], 65, 13, 4, 42)
					this.drawFromPNGdata(img, this.MUTE[mute], 49, 41, 13, 13)
				}

				if (aOn !== null) {
					this.drawFromPNGdata(img, this.GATE[aOn], 21, 29, 7, 7)
				}
				if (bOn !== null) {
					this.drawFromPNGdata(img, this.GATE[bOn], 38, 29, 7, 7)
				}

				if (dfr !== null && dfr > 0) {
					this.drawFromPNGdata(img, this.DFR[dfr], 4, 41, 37, 13)
				}

				out = img.toBase64()
				this.savedIcons[id] = out
			} else {
				out = this.savedIcons[id]
			}
		}

		return out
	}

	/**
	 * Returns the input level meters icon.
	 *
	 * @param {Object} image - the image raster object
	 * @param {number} i1 - input 1 icon
	 * @param {number} i2 - input 2 icon
	 * @param {number} i3 - input 3 icon
	 * @param {number} i4 - input 4 icon
	 * @param {number} i5 - input 5 icon
	 * @param {number} i6 - input 6 icon
	 * @param {number} i7 - input 7 icon
	 * @param {number} i8 - input 8 icon
	 * @param {number} i9 - input 9 icon
	 * @returns {String} base64 encoded PNG
	 * @access public
	 * @since 1.0.0
	 */
	getInputLevels(image, i1, i2, i3, i4, i5, i6, i7, i8, i9) {
		let out

		if (image && image.width && image.height) {
			let id = `${image.width}x${image.height}I${i1}_${i2}_${i3}_${i4}_${i5}_${i6}_${i7}_${i8}_${i9}`

			if (this.savedIcons[id] === undefined) {
				let img = new Image(image.width, image.height)

				this.drawFromPNGdata(img, this.AUDIO[i1], 6, 14, 4, 42)
				this.drawFromPNGdata(img, this.AUDIO[i2], 13, 14, 4, 42)
				this.drawFromPNGdata(img, this.AUDIO[i3], 20, 14, 4, 42)
				this.drawFromPNGdata(img, this.AUDIO[i4], 27, 14, 4, 42)
				this.drawFromPNGdata(img, this.AUDIO[i5], 34, 14, 4, 42)
				this.drawFromPNGdata(img, this.AUDIO[i6], 41, 14, 4, 42)
				this.drawFromPNGdata(img, this.AUDIO[i7], 48, 14, 4, 42)
				this.drawFromPNGdata(img, this.AUDIO[i8], 55, 14, 4, 42)
				this.drawFromPNGdata(img, this.AUDIO[i9], 62, 14, 4, 42)

				out = img.toBase64()

				this.savedIcons[id] = out
			} else {
				out = this.savedIcons[id]
			}
		}

		return out
	}

	/**
	 * Returns the mixer level meters icon.
	 *
	 * @param {Object} image - the image raster object
	 * @param {number} mA - mix A icon
	 * @param {number} mB - mix B icon
	 * @param {String} limA - mix A limiter state
	 * @param {String} limB - mix B limiter state
	 * @param {String} muteA - mix A mute state
	 * @param {String} muteB - mix B mute state
	 * @returns {String} base64 encoded PNG
	 * @access public
	 * @since 1.0.0
	 */
	getMixLevels(image, mA, mB, limA, limB, muteA, muteB) {
		let id = `${image.width}x${image.height}ML${mA}_${mB}_${limA}_${limB}_${muteA}_${muteB}`
		let out

		if (this.savedIcons[id] === undefined) {
			let img = new Image(image.width, image.height)

			this.drawFromPNGdata(img, this.AUDIO[mA], 28, 14, 4, 42)
			this.drawFromPNGdata(img, this.AUDIO[mB], 38, 14, 4, 42)
			this.drawFromPNGdata(img, this.LIMITER[limA], 11, 31, 7, 7)
			this.drawFromPNGdata(img, this.LIMITER[limB], 54, 31, 7, 7)
			this.drawFromPNGdata(img, this.MUTE[muteA], 9, 41, 13, 13)
			this.drawFromPNGdata(img, this.MUTE[muteB], 52, 41, 13, 13)

			out = img.toBase64()

			this.savedIcons[id] = out
		} else {
			out = this.savedIcons[id]
		}

		return out
	}

	/**
	 * Returns the mixer level meters icon.
	 *
	 * @param {Object} image - the image raster object
	 * @param {number} audio - audio bitmap
	 * @param {String} limiter - limiter state
	 * @param {String} mute - mute state
	 * @returns {String} base64 encoded PNG
	 * @access public
	 * @since 1.0.0
	 */
	getMixStatus(image, audio, limiter, mute) {
		let out

		if (image && image.width && image.height) {
			let id = `${image.width}x${image.height}MS${audio}_${limiter}_${mute}`

			if (this.savedIcons[id] === undefined) {
				let img = new Image(image.width, image.height)

				this.drawFromPNGdata(img, this.AUDIO[audio], 65, 13, 4, 42)
				this.drawFromPNGdata(img, this.LIMITER[limiter], 51, 29, 7, 7)
				this.drawFromPNGdata(img, this.MUTE[mute], 49, 41, 13, 13)

				out = img.toBase64()

				this.savedIcons[id] = out
			} else {
				out = this.savedIcons[id]
			}
		}

		return out
	}

	/**
	 * Returns the output level meters icon.
	 *
	 * @param {Object} image - the image raster object
	 * @param {number} o1 - output 1 icon
	 * @param {number} o2 - output 2 icon
	 * @param {number} o3 - output 3 icon
	 * @param {number} o4 - output 4 icon
	 * @param {number} o5 - output 5 icon
	 * @param {number} o6 - output 6 icon
	 * @param {number} o7 - output 7 icon
	 * @param {number} o8 - output 8 icon
	 * @returns {String} base64 encoded PNG
	 * @access public
	 * @since 1.0.0
	 */
	getOutputLevels(image, o1, o2, o3, o4, o5, o6, o7, o8) {
		let out

		if (image && image.width && image.height) {
			let id = `${image.width}x${image.height}O${o1}_${o2}_${o3}_${o4}_${o5}_${o6}_${o7}_${o8}`

			if (this.savedIcons[id] === undefined) {
				let img = new Image(image.width, image.height)

				this.drawFromPNGdata(img, this.AUDIO[o1], 10, 14, 4, 42)
				this.drawFromPNGdata(img, this.AUDIO[o2], 17, 14, 4, 42)
				this.drawFromPNGdata(img, this.AUDIO[o3], 24, 14, 4, 42)
				this.drawFromPNGdata(img, this.AUDIO[o4], 31, 14, 4, 42)
				this.drawFromPNGdata(img, this.AUDIO[o5], 38, 14, 4, 42)
				this.drawFromPNGdata(img, this.AUDIO[o6], 45, 14, 4, 42)
				this.drawFromPNGdata(img, this.AUDIO[o7], 52, 14, 4, 42)
				this.drawFromPNGdata(img, this.AUDIO[o8], 59, 14, 4, 42)

				out = img.toBase64()

				this.savedIcons[id] = out
			} else {
				out = this.savedIcons[id]
			}
		}

		return out
	}
}
