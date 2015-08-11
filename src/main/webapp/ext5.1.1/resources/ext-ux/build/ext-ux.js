Ext.define("Ext.ux.colorpick.Selection", {
    mixinId: "colorselection",
    config: {format: "hex6", value: "FF0000", color: null, previousColor: null},
    applyColor: function (a) {
        var b = a;
        if (Ext.isString(b)) {
            b = Ext.ux.colorpick.ColorUtils.parseColor(a)
        }
        return b
    },
    applyValue: function (a) {
        var b = Ext.ux.colorpick.ColorUtils.parseColor(a);
        return this.formatColor(b)
    },
    formatColor: function (a) {
        return Ext.ux.colorpick.ColorUtils.formats[this.getFormat()](a)
    },
    updateColor: function (a) {
        var b = this;
        if (!b.syncing) {
            b.syncing = true;
            b.setValue(b.formatColor(a));
            b.syncing = false
        }
    },
    updateValue: function (c, a) {
        var b = this;
        if (!b.syncing) {
            b.syncing = true;
            b.setColor(c);
            b.syncing = false
        }
        this.fireEvent("change", b, c, a)
    }
});
Ext.define("Ext.ux.colorpick.ColorUtils", function (a) {
    var b = Ext.isIE && Ext.ieVersion < 10;
    return {
        singleton: true,
        constructor: function () {
            a = this
        },
        backgroundTpl: b ? "filter: progid:DXImageTransform.Microsoft.gradient(GradientType=0, startColorstr='#{alpha}{hex}', endColorstr='#{alpha}{hex}');" : "background: {rgba};",
        setBackground: b ? function (e, c) {
            if (e) {
                var d = Ext.XTemplate.getTpl(a, "backgroundTpl"), f = {
                    hex: a.rgb2hex(c.r, c.g, c.b),
                    alpha: Math.floor(c.a * 255).toString(16)
                }, g = d.apply(f);
                e.applyStyles(g)
            }
        } : function (e, c) {
            if (e) {
                var d = Ext.XTemplate.getTpl(a, "backgroundTpl"), f = {rgba: a.getRGBAString(c)}, g = d.apply(f);
                e.applyStyles(g)
            }
        },
        formats: {
            HEX6: function (c) {
                return a.rgb2hex(c.r, c.g, c.b)
            }, HEX8: function (c) {
                var e = a.rgb2hex(c.r, c.g, c.b), d = Math.round(c.a * 255).toString(16);
                if (d.length < 2) {
                    e += "0"
                }
                e += d.toUpperCase();
                return e
            }
        },
        hexRe: /#?([0-9a-f]{3,8})/i,
        rgbaAltRe: /rgba\(\s*([\w#\d]+)\s*,\s*([\d\.]+)\s*\)/,
        rgbaRe: /rgba\(\s*([\d\.]+)\s*,\s*([\d\.]+)\s*,\s*([\d\.]+)\s*,\s*([\d\.]+)\s*\)/,
        rgbRe: /rgb\(\s*([\d\.]+)\s*,\s*([\d\.]+)\s*,\s*([\d\.]+)\s*\)/,
        parseColor: function (c) {
            if (!c) {
                return null
            }
            var h = this, g = h.colorMap[c], f, e, d;
            if (g) {
                e = {r: g[0], g: g[1], b: g[2], a: 1}
            } else {
                if (c === "transparent") {
                    e = {r: 0, g: 0, b: 0, a: 0}
                } else {
                    f = h.hexRe.exec(c);
                    if (f) {
                        f = f[1];
                        switch (f.length) {
                            default:
                                return null;
                            case 3:
                                e = {
                                    r: parseInt(f[0] + f[0], 16),
                                    g: parseInt(f[1] + f[1], 16),
                                    b: parseInt(f[2] + f[2], 16),
                                    a: 1
                                };
                                break;
                            case 6:
                            case 8:
                                e = {
                                    r: parseInt(f.substr(0, 2), 16),
                                    g: parseInt(f.substr(2, 2), 16),
                                    b: parseInt(f.substr(4, 2), 16),
                                    a: parseInt(f.substr(6, 2) || "ff", 16) / 255
                                };
                                break
                        }
                    } else {
                        f = h.rgbaRe.exec(c);
                        if (f) {
                            e = {r: parseFloat(f[1]), g: parseFloat(f[2]), b: parseFloat(f[3]), a: parseFloat(f[4])}
                        } else {
                            f = h.rgbaAltRe.exec(c);
                            if (f) {
                                e = h.parseColor(f[1]);
                                e.a = parseFloat(f[2]);
                                return e
                            }
                            f = h.rgbRe.exec(c);
                            if (f) {
                                e = {r: parseFloat(f[1]), g: parseFloat(f[2]), b: parseFloat(f[3]), a: 1}
                            } else {
                                return null
                            }
                        }
                    }
                }
            }
            d = this.rgb2hsv(e.r, e.g, e.b);
            return Ext.apply(e, d)
        },
        getRGBAString: function (c) {
            return "rgba(" + c.r + "," + c.g + "," + c.b + "," + c.a + ")"
        },
        getRGBString: function (c) {
            return "rgb(" + c.r + "," + c.g + "," + c.b + ")"
        },
        hsv2rgb: function (k, j, g) {
            k = k * 360;
            if (k === 360) {
                k = 0
            }
            var l = g * j;
            var f = k / 60;
            var e = l * (1 - Math.abs(f % 2 - 1));
            var i = [0, 0, 0];
            switch (Math.floor(f)) {
                case 0:
                    i = [l, e, 0];
                    break;
                case 1:
                    i = [e, l, 0];
                    break;
                case 2:
                    i = [0, l, e];
                    break;
                case 3:
                    i = [0, e, l];
                    break;
                case 4:
                    i = [e, 0, l];
                    break;
                case 5:
                    i = [l, 0, e];
                    break;
                default:
                    break
            }
            var d = g - l;
            i[0] += d;
            i[1] += d;
            i[2] += d;
            i[0] = Math.round(i[0] * 255);
            i[1] = Math.round(i[1] * 255);
            i[2] = Math.round(i[2] * 255);
            return {r: i[0], g: i[1], b: i[2]}
        },
        rgb2hsv: function (d, i, l) {
            d = d / 255;
            i = i / 255;
            l = l / 255;
            var j = Math.max(d, i, l);
            var e = Math.min(d, i, l);
            var k = j - e;
            var o = 0;
            if (k !== 0) {
                if (j === d) {
                    o = ((i - l) / k) % 6
                } else {
                    if (j === i) {
                        o = ((l - d) / k) + 2
                    } else {
                        if (j === l) {
                            o = ((d - i) / k) + 4
                        }
                    }
                }
            }
            var f = o * 60;
            if (f === 360) {
                f = 0
            }
            var n = j;
            var p = 0;
            if (k !== 0) {
                p = k / n
            }
            f = f / 360;
            if (f < 0) {
                f = f + 1
            }
            return {h: f, s: p, v: n}
        },
        rgb2hex: function (e, d, c) {
            e = e.toString(16);
            d = d.toString(16);
            c = c.toString(16);
            if (e.length < 2) {
                e = "0" + e
            }
            if (d.length < 2) {
                d = "0" + d
            }
            if (c.length < 2) {
                c = "0" + c
            }
            return (e + d + c).toUpperCase()
        },
        colorMap: {
            aliceblue: [240, 248, 255],
            antiquewhite: [250, 235, 215],
            aqua: [0, 255, 255],
            aquamarine: [127, 255, 212],
            azure: [240, 255, 255],
            beige: [245, 245, 220],
            bisque: [255, 228, 196],
            black: [0, 0, 0],
            blanchedalmond: [255, 235, 205],
            blue: [0, 0, 255],
            blueviolet: [138, 43, 226],
            brown: [165, 42, 42],
            burlywood: [222, 184, 135],
            cadetblue: [95, 158, 160],
            chartreuse: [127, 255, 0],
            chocolate: [210, 105, 30],
            coral: [255, 127, 80],
            cornflowerblue: [100, 149, 237],
            cornsilk: [255, 248, 220],
            crimson: [220, 20, 60],
            cyan: [0, 255, 255],
            darkblue: [0, 0, 139],
            darkcyan: [0, 139, 139],
            darkgoldenrod: [184, 132, 11],
            darkgray: [169, 169, 169],
            darkgreen: [0, 100, 0],
            darkgrey: [169, 169, 169],
            darkkhaki: [189, 183, 107],
            darkmagenta: [139, 0, 139],
            darkolivegreen: [85, 107, 47],
            darkorange: [255, 140, 0],
            darkorchid: [153, 50, 204],
            darkred: [139, 0, 0],
            darksalmon: [233, 150, 122],
            darkseagreen: [143, 188, 143],
            darkslateblue: [72, 61, 139],
            darkslategray: [47, 79, 79],
            darkslategrey: [47, 79, 79],
            darkturquoise: [0, 206, 209],
            darkviolet: [148, 0, 211],
            deeppink: [255, 20, 147],
            deepskyblue: [0, 191, 255],
            dimgray: [105, 105, 105],
            dimgrey: [105, 105, 105],
            dodgerblue: [30, 144, 255],
            firebrick: [178, 34, 34],
            floralwhite: [255, 255, 240],
            forestgreen: [34, 139, 34],
            fuchsia: [255, 0, 255],
            gainsboro: [220, 220, 220],
            ghostwhite: [248, 248, 255],
            gold: [255, 215, 0],
            goldenrod: [218, 165, 32],
            gray: [128, 128, 128],
            green: [0, 128, 0],
            greenyellow: [173, 255, 47],
            grey: [128, 128, 128],
            honeydew: [240, 255, 240],
            hotpink: [255, 105, 180],
            indianred: [205, 92, 92],
            indigo: [75, 0, 130],
            ivory: [255, 255, 240],
            khaki: [240, 230, 140],
            lavender: [230, 230, 250],
            lavenderblush: [255, 240, 245],
            lawngreen: [124, 252, 0],
            lemonchiffon: [255, 250, 205],
            lightblue: [173, 216, 230],
            lightcoral: [240, 128, 128],
            lightcyan: [224, 255, 255],
            lightgoldenrodyellow: [250, 250, 210],
            lightgray: [211, 211, 211],
            lightgreen: [144, 238, 144],
            lightgrey: [211, 211, 211],
            lightpink: [255, 182, 193],
            lightsalmon: [255, 160, 122],
            lightseagreen: [32, 178, 170],
            lightskyblue: [135, 206, 250],
            lightslategray: [119, 136, 153],
            lightslategrey: [119, 136, 153],
            lightsteelblue: [176, 196, 222],
            lightyellow: [255, 255, 224],
            lime: [0, 255, 0],
            limegreen: [50, 205, 50],
            linen: [250, 240, 230],
            magenta: [255, 0, 255],
            maroon: [128, 0, 0],
            mediumaquamarine: [102, 205, 170],
            mediumblue: [0, 0, 205],
            mediumorchid: [186, 85, 211],
            mediumpurple: [147, 112, 219],
            mediumseagreen: [60, 179, 113],
            mediumslateblue: [123, 104, 238],
            mediumspringgreen: [0, 250, 154],
            mediumturquoise: [72, 209, 204],
            mediumvioletred: [199, 21, 133],
            midnightblue: [25, 25, 112],
            mintcream: [245, 255, 250],
            mistyrose: [255, 228, 225],
            moccasin: [255, 228, 181],
            navajowhite: [255, 222, 173],
            navy: [0, 0, 128],
            oldlace: [253, 245, 230],
            olive: [128, 128, 0],
            olivedrab: [107, 142, 35],
            orange: [255, 165, 0],
            orangered: [255, 69, 0],
            orchid: [218, 112, 214],
            palegoldenrod: [238, 232, 170],
            palegreen: [152, 251, 152],
            paleturquoise: [175, 238, 238],
            palevioletred: [219, 112, 147],
            papayawhip: [255, 239, 213],
            peachpuff: [255, 218, 185],
            peru: [205, 133, 63],
            pink: [255, 192, 203],
            plum: [221, 160, 203],
            powderblue: [176, 224, 230],
            purple: [128, 0, 128],
            red: [255, 0, 0],
            rosybrown: [188, 143, 143],
            royalblue: [65, 105, 225],
            saddlebrown: [139, 69, 19],
            salmon: [250, 128, 114],
            sandybrown: [244, 164, 96],
            seagreen: [46, 139, 87],
            seashell: [255, 245, 238],
            sienna: [160, 82, 45],
            silver: [192, 192, 192],
            skyblue: [135, 206, 235],
            slateblue: [106, 90, 205],
            slategray: [119, 128, 144],
            slategrey: [119, 128, 144],
            snow: [255, 255, 250],
            springgreen: [0, 255, 127],
            steelblue: [70, 130, 180],
            tan: [210, 180, 140],
            teal: [0, 128, 128],
            thistle: [216, 191, 216],
            tomato: [255, 99, 71],
            turquoise: [64, 224, 208],
            violet: [238, 130, 238],
            wheat: [245, 222, 179],
            white: [255, 255, 255],
            whitesmoke: [245, 245, 245],
            yellow: [255, 255, 0],
            yellowgreen: [154, 205, 5]
        }
    }
}, function (c) {
    var a = c.formats, b = {};
    a["#HEX6"] = function (d) {
        return "#" + a.HEX6(d)
    };
    a["#HEX8"] = function (d) {
        return "#" + a.HEX8(d)
    };
    Ext.Object.each(a, function (d, e) {
        b[d.toLowerCase()] = function (f) {
            var g = e(f);
            return g.toLowerCase()
        }
    });
    Ext.apply(a, b)
});
Ext.define("Ext.ux.colorpick.ColorMapController", {
    extend: "Ext.app.ViewController",
    alias: "controller.colorpickercolormapcontroller",
    requires: ["Ext.ux.colorpick.ColorUtils"],
    onFirstBoxReady: function () {
        var d = this, c = d.getView(), b = c.down("#dragHandle"), a = b.dd;
        a.constrain = true;
        a.constrainTo = c.getEl();
        a.initialConstrainTo = a.constrainTo;
        a.on("drag", Ext.bind(d.onHandleDrag, d));
        d.mon(c.getEl(), {mousedown: d.onMouseDown, dragstart: d.onDragStart, scope: d})
    },
    onHandleDrag: function (c, g) {
        var i = this, a = i.getView(), h = a.down("#dragHandle"), l = h.getX() - a.getX(), j = h.getY() - a.getY(), f = a.getEl(), k = f.getWidth(), m = f.getHeight(), b = l / k, d = j / m;
        if (b > 0.99) {
            b = 1
        }
        if (d > 0.99) {
            d = 1
        }
        a.fireEvent("handledrag", b, d)
    },
    onMouseDown: function (d) {
        var c = this, b = c.getView(), a = b.down("#dragHandle");
        a.setY(d.getY());
        a.setX(d.getX());
        c.onHandleDrag();
        a.dd.onMouseDown(d, a.dd.el)
    },
    onDragStart: function (d) {
        var c = this, b = c.getView(), a = b.down("#dragHandle");
        a.dd.onDragStart(d, a.dd.el)
    },
    onMapClick: function (h) {
        var d = this, c = d.getView(), a = c.down("#dragHandle"), i = c.getXY(), b = h.getXY(), g, f;
        g = b[0] - i[0];
        f = b[1] - i[1];
        a.getEl().setStyle({left: g + "px", top: f + "px"});
        d.onHandleDrag()
    },
    onColorBindingChanged: function (a) {
        var k = this, d = k.getViewModel(), f = d.get("selectedColor"), g, b = k.getView(), j = b.down("#dragHandle"), i = b.getEl(), m = i.getWidth(), n = i.getHeight(), c, h, e, l;
        g = Ext.ux.colorpick.ColorUtils.rgb2hsv(f.r, f.g, f.b);
        c = g.s;
        e = m * c;
        h = 1 - g.v;
        l = n * h;
        j.getEl().setStyle({left: e + "px", top: l + "px"})
    },
    onHueBindingChanged: function (b) {
        var e = this, c = e.getViewModel(), a, d;
        a = Ext.ux.colorpick.ColorUtils.hsv2rgb(b, 1, 1);
        d = Ext.ux.colorpick.ColorUtils.rgb2hex(a.r, a.g, a.b);
        e.getView().getEl().applyStyles({"background-color": "#" + d})
    }
});
Ext.define("Ext.ux.colorpick.ColorMap", {
    extend: "Ext.container.Container",
    alias: "widget.colorpickercolormap",
    controller: "colorpickercolormapcontroller",
    requires: ["Ext.ux.colorpick.ColorMapController"],
    cls: Ext.baseCSSPrefix + "colorpicker-colormap",
    items: [{
        xtype: "component",
        cls: Ext.baseCSSPrefix + "colorpicker-colormap-draghandle-container",
        itemId: "dragHandle",
        width: 1,
        height: 1,
        draggable: true,
        html: '<div class="' + Ext.baseCSSPrefix + 'colorpicker-colormap-draghandle"></div>'
    }],
    listeners: {
        boxready: {single: true, fn: "onFirstBoxReady", scope: "controller"},
        colorbindingchanged: {fn: "onColorBindingChanged", scope: "controller"},
        huebindingchanged: {fn: "onHueBindingChanged", scope: "controller"}
    },
    afterRender: function () {
        var b = this, c = b.mapGradientUrl, a = b.el;
        b.callParent();
        if (!c) {
            c = a.getStyle("background-image");
            c = c.substring(4, c.length - 1);
            if (c.indexOf('"') === 0) {
                c = c.substring(1, c.length - 1)
            }
            Ext.ux.colorpick.ColorMap.prototype.mapGradientUrl = c
        }
        a.setStyle("background-image", "none");
        a = b.layout.getElementTarget();
        a.createChild({tag: "img", cls: Ext.baseCSSPrefix + "colorpicker-colormap-blender", src: c})
    },
    setPosition: function (c) {
        var b = this, a = b.down("#dragHandle");
        if (!a.dd || !a.dd.constrain) {
            return
        }
        if (typeof a.dd.dragEnded !== "undefined" && !a.dd.dragEnded) {
            return
        }
        b.fireEvent("colorbindingchanged", c)
    },
    setHue: function (a) {
        var b = this;
        if (!b.getEl()) {
            return
        }
        b.fireEvent("huebindingchanged", a)
    }
});
Ext.define("Ext.ux.colorpick.SelectorModel", {
    extend: "Ext.app.ViewModel",
    alias: "viewmodel.colorpick-selectormodel",
    requires: ["Ext.ux.colorpick.ColorUtils"],
    data: {
        selectedColor: {r: 255, g: 255, b: 255, h: 0, s: 1, v: 1, a: 1},
        previousColor: {r: 0, g: 0, b: 0, h: 0, s: 1, v: 1, a: 1}
    },
    formulas: {
        hex: {
            get: function (d) {
                var f = d("selectedColor.r").toString(16), e = d("selectedColor.g").toString(16), c = d("selectedColor.b").toString(16), a;
                a = Ext.ux.colorpick.ColorUtils.rgb2hex(f, e, c);
                return "#" + a
            }, set: function (b) {
                var a = Ext.ux.colorpick.ColorUtils.hex2rgb(b);
                this.changeRGB(a)
            }
        }, red: {
            get: function (a) {
                return a("selectedColor.r")
            }, set: function (a) {
                this.changeRGB({r: a})
            }
        }, green: {
            get: function (a) {
                return a("selectedColor.g")
            }, set: function (a) {
                this.changeRGB({g: a})
            }
        }, blue: {
            get: function (a) {
                return a("selectedColor.b")
            }, set: function (a) {
                this.changeRGB({b: a})
            }
        }, hue: {
            get: function (a) {
                return a("selectedColor.h") * 360
            }, set: function (a) {
                this.changeHSV({h: a / 360})
            }
        }, saturation: {
            get: function (a) {
                return a("selectedColor.s") * 100
            }, set: function (a) {
                this.changeHSV({s: a / 100})
            }
        }, value: {
            get: function (b) {
                var a = b("selectedColor.v");
                return a * 100
            }, set: function (a) {
                this.changeHSV({v: a / 100})
            }
        }, alpha: {
            get: function (c) {
                var b = c("selectedColor.a");
                return b * 100
            }, set: function (a) {
                this.set("selectedColor", Ext.applyIf({a: a / 100}, this.data.selectedColor))
            }
        }
    },
    changeHSV: function (b) {
        Ext.applyIf(b, this.data.selectedColor);
        var a = Ext.ux.colorpick.ColorUtils.hsv2rgb(b.h, b.s, b.v);
        b.r = a.r;
        b.g = a.g;
        b.b = a.b;
        this.set("selectedColor", b)
    },
    changeRGB: function (b) {
        Ext.applyIf(b, this.data.selectedColor);
        var a = Ext.ux.colorpick.ColorUtils.rgb2hsv(b.r, b.g, b.b);
        b.h = a.h;
        b.s = a.s;
        b.v = a.v;
        this.set("selectedColor", b)
    }
});
Ext.define("Ext.ux.colorpick.SelectorController", {
    extend: "Ext.app.ViewController",
    alias: "controller.colorpick-selectorcontroller",
    requires: ["Ext.ux.colorpick.ColorUtils"],
    initViewModel: function () {
        var b = this, a = b.getView();
        a.childViewModel.bind("{selectedColor}", function (c) {
            a.setColor(c)
        })
    },
    destroy: function () {
        var c = this, b = c.getView(), a = b.childViewModel;
        if (a) {
            a.destroy();
            b.childViewModel = null
        }
        c.callParent()
    },
    changeHSV: function (d) {
        var a = this.getView(), b = a.getColor(), c;
        Ext.applyIf(d, b);
        c = Ext.ux.colorpick.ColorUtils.hsv2rgb(d.h, d.s, d.v);
        Ext.apply(d, c);
        a.setColor(d)
    },
    onColorMapHandleDrag: function (b, a) {
        this.changeHSV({s: b, v: 1 - a})
    },
    onValueSliderHandleDrag: function (a) {
        this.changeHSV({v: 1 - a})
    },
    onSaturationSliderHandleDrag: function (a) {
        this.changeHSV({s: 1 - a})
    },
    onHueSliderHandleDrag: function (a) {
        this.changeHSV({h: 1 - a})
    },
    onAlphaSliderHandleDrag: function (c) {
        var a = this.getView(), b = a.getColor(), d = Ext.applyIf({a: 1 - c}, b);
        a.setColor(d);
        a.el.repaint()
    },
    onPreviousColorSelected: function (c, b) {
        var a = this.getView();
        a.setColor(b)
    },
    onOK: function () {
        var b = this, a = b.getView();
        a.fireEvent("ok", a, a.getValue())
    },
    onCancel: function () {
        this.fireViewEvent("cancel", this.getView())
    },
    onResize: function () {
        var j = this, c = j.getView(), i = c.childViewModel, e = j.getReferences(), g, f, d, b;
        if (!j.hasResizedOnce) {
            j.hasResizedOnce = true;
            return
        }
        g = i.get("hue");
        f = i.get("saturation");
        d = i.get("value");
        b = i.get("alpha");
        console.log("h=" + g);
        e.colorMap.setPosition(i.getData());
        e.hueSlider.setHue(g);
        e.satSlider.setSaturation(f);
        e.valueSlider.setValue(d);
        e.alphaSlider.setAlpha(b)
    }
});
Ext.define("Ext.ux.colorpick.ColorPreview", {
    extend: "Ext.Component",
    alias: "widget.colorpickercolorpreview",
    requires: ["Ext.util.Format"],
    style: "position: relative",
    html: '<div class="filter" style="height:100%; width:100%; position: absolute;"></div><a class="btn" style="height:100%; width:100%; position: absolute;"></a>',
    cls: "x-colorpreview",
    height: 256,
    onRender: function () {
        var a = this;
        a.callParent(arguments);
        a.mon(a.el.down(".btn"), "click", a.onClick, a)
    },
    onClick: function () {
        this.fireEvent("click", this, this.color)
    },
    setColor: function (a) {
        var c = this, b = c.getEl();
        if (!b) {
            return
        }
        c.color = a;
        c.applyBgStyle(a)
    },
    bgStyleTpl: Ext.create("Ext.XTemplate", Ext.isIE && Ext.ieVersion < 10 ? "filter: progid:DXImageTransform.Microsoft.gradient(GradientType=0, startColorstr='#{hexAlpha}{hex}', endColorstr='#{hexAlpha}{hex}');" : "background: {rgba};"),
    applyBgStyle: function (a) {
        var e = this, g = Ext.ux.colorpick.ColorUtils, c = e.getEl().down(".filter"), d, f, b, h;
        d = g.rgb2hex(a.r, a.g, a.b);
        f = Ext.util.Format.hex(Math.floor(a.a * 255), 2);
        b = g.getRGBAString(a);
        h = this.bgStyleTpl.apply({hex: d, hexAlpha: f, rgba: b});
        c.applyStyles(h)
    }
});
Ext.define("Ext.ux.colorpick.SliderController", {
    extend: "Ext.app.ViewController",
    alias: "controller.colorpick-slidercontroller",
    boxReady: function (d) {
        var e = this, c = e.getDragContainer(), b = e.getDragHandle(), a = b.dd;
        a.constrain = true;
        a.constrainTo = c.getEl();
        a.initialConstrainTo = a.constrainTo;
        a.on("drag", e.onHandleDrag, e)
    },
    getDragHandle: function () {
        return this.view.lookupReference("dragHandle")
    },
    getDragContainer: function () {
        return this.view.lookupReference("dragHandleContainer")
    },
    onHandleDrag: function (d) {
        var g = this, i = g.getView(), a = g.getDragContainer(), f = g.getDragHandle(), h = f.getY() - a.getY(), c = a.getEl(), j = c.getHeight(), b = h / j;
        if (b > 0.99) {
            b = 1
        }
        i.fireEvent("handledrag", b)
    },
    onMouseDown: function (c) {
        var b = this, a = b.getDragHandle(), d = c.getY();
        a.setY(d);
        b.onHandleDrag();
        a.el.repaint();
        a.dd.onMouseDown(c, a.dd.el)
    },
    onDragStart: function (c) {
        var b = this, a = b.getDragHandle();
        a.dd.onDragStart(c, a.dd.el)
    },
    onMouseUp: function () {
        var a = this.getDragHandle();
        a.dd.dragEnded = true
    }
});
Ext.define("Ext.ux.colorpick.Slider", {
    extend: "Ext.container.Container",
    xtype: "colorpickerslider",
    controller: "colorpick-slidercontroller",
    baseCls: Ext.baseCSSPrefix + "colorpicker-slider",
    layout: "center",
    requires: ["Ext.layout.container.Center", "Ext.ux.colorpick.SliderController"],
    referenceHolder: true,
    listeners: {element: "el", mousedown: "onMouseDown", mouseup: "onMouseUp", dragstart: "onDragStart"},
    items: {
        xtype: "container",
        cls: Ext.baseCSSPrefix + "colorpicker-draghandle-container",
        reference: "dragHandleContainer",
        height: "100%",
        items: {
            xtype: "component",
            cls: Ext.baseCSSPrefix + "colorpicker-draghandle-outer",
            reference: "dragHandle",
            width: "100%",
            height: 1,
            draggable: true,
            html: '<div class="' + Ext.baseCSSPrefix + 'colorpicker-draghandle"></div>'
        }
    },
    getDragHandle: function () {
        return this.lookupReference("dragHandle")
    },
    getDragContainer: function () {
        return this.lookupReference("dragHandleContainer")
    }
});
Ext.define("Ext.ux.colorpick.SliderAlpha", {
    extend: "Ext.ux.colorpick.Slider",
    alias: "widget.colorpickerslideralpha",
    cls: Ext.baseCSSPrefix + "colorpicker-alpha",
    requires: ["Ext.XTemplate"],
    gradientStyleTpl: Ext.create("Ext.XTemplate", Ext.isIE && Ext.ieVersion < 10 ? "filter: progid:DXImageTransform.Microsoft.gradient(GradientType=0, startColorstr='#FF{hex}', endColorstr='#00{hex}');" : "background: -mox-linear-gradient(top, rgba({r}, {g}, {b}, 1) 0%, rgba({r}, {g}, {b}, 0) 100%);background: -webkit-linear-gradient(top,rgba({r}, {g}, {b}, 1) 0%, rgba({r}, {g}, {b}, 0) 100%);background: -o-linear-gradient(top, rgba({r}, {g}, {b}, 1) 0%, rgba({r}, {g}, {b}, 0) 100%);background: -ms-linear-gradient(top, rgba({r}, {g}, {b}, 1) 0%, rgba({r}, {g}, {b}, 0) 100%);background: linear-gradient(to bottom, rgba({r}, {g}, {b}, 1) 0%, rgba({r}, {g}, {b}, 0) 100%);"),
    setAlpha: function (g) {
        var d = this, b = d.getDragContainer(), a = d.getDragHandle(), f = b.getEl(), e = f.getHeight(), c, h;
        if (!a.dd || !a.dd.constrain) {
            return
        }
        if (typeof a.dd.dragEnded !== "undefined" && !a.dd.dragEnded) {
            return
        }
        h = e * (1 - (g / 100));
        c = a.getEl();
        c.setStyle({top: h})
    },
    setColor: function (b) {
        var e = this, a = e.getDragContainer(), d, c;
        if (!e.getEl()) {
            return
        }
        d = Ext.ux.colorpick.ColorUtils.rgb2hex(b.r, b.g, b.b);
        c = a.getEl().down(".x-autocontainer-innerCt");
        c.applyStyles(e.gradientStyleTpl.apply({hex: d, r: b.r, g: b.g, b: b.b}))
    }
});
Ext.define("Ext.ux.colorpick.SliderSaturation", {
    extend: "Ext.ux.colorpick.Slider",
    alias: "widget.colorpickerslidersaturation",
    cls: Ext.baseCSSPrefix + "colorpicker-saturation",
    gradientStyleTpl: Ext.create("Ext.XTemplate", Ext.isIE && Ext.ieVersion < 10 ? "filter: progid:DXImageTransform.Microsoft.gradient(GradientType=0, startColorstr='#{hex}', endColorstr='#ffffff');" : "background: -mox-linear-gradient(top, #{hex} 0%, #ffffff 100%);background: -webkit-linear-gradient(top, #{hex} 0%,#ffffff 100%);background: -o-linear-gradient(top, #{hex} 0%,#ffffff 100%);background: -ms-linear-gradient(top, #{hex} 0%,#ffffff 100%);background: linear-gradient(to bottom, #{hex} 0%,#ffffff 100%);"),
    setSaturation: function (e) {
        var d = this, b = d.getDragContainer(), a = d.getDragHandle(), g = b.getEl(), f = g.getHeight(), c, h;
        if (!a.dd || !a.dd.constrain) {
            return
        }
        if (typeof a.dd.dragEnded !== "undefined" && !a.dd.dragEnded) {
            return
        }
        c = 1 - (e / 100);
        h = f * c;
        a.getEl().setStyle({top: h + "px"})
    },
    setHue: function (b) {
        var e = this, a = e.getDragContainer(), c, d;
        if (!e.getEl()) {
            return
        }
        c = Ext.ux.colorpick.ColorUtils.hsv2rgb(b, 1, 1);
        d = Ext.ux.colorpick.ColorUtils.rgb2hex(c.r, c.g, c.b);
        a.getEl().applyStyles(e.gradientStyleTpl.apply({hex: d}))
    }
});
Ext.define("Ext.ux.colorpick.SliderValue", {
    extend: "Ext.ux.colorpick.Slider",
    alias: "widget.colorpickerslidervalue",
    cls: Ext.baseCSSPrefix + "colorpicker-value",
    requires: ["Ext.XTemplate"],
    gradientStyleTpl: Ext.create("Ext.XTemplate", Ext.isIE && Ext.ieVersion < 10 ? "filter: progid:DXImageTransform.Microsoft.gradient(GradientType=0, startColorstr='#{hex}', endColorstr='#000000');" : "background: -mox-linear-gradient(top, #{hex} 0%, #000000 100%);background: -webkit-linear-gradient(top, #{hex} 0%,#000000 100%);background: -o-linear-gradient(top, #{hex} 0%,#000000 100%);background: -ms-linear-gradient(top, #{hex} 0%,#000000 100%);background: linear-gradient(to bottom, #{hex} 0%,#000000 100%);"),
    setValue: function (g) {
        var d = this, b = d.getDragContainer(), a = d.getDragHandle(), f = b.getEl(), e = f.getHeight(), c, h;
        if (!a.dd || !a.dd.constrain) {
            return
        }
        if (typeof a.dd.dragEnded !== "undefined" && !a.dd.dragEnded) {
            return
        }
        c = 1 - (g / 100);
        h = e * c;
        a.getEl().setStyle({top: h + "px"})
    },
    setHue: function (b) {
        var e = this, a = e.getDragContainer(), c, d;
        if (!e.getEl()) {
            return
        }
        c = Ext.ux.colorpick.ColorUtils.hsv2rgb(b, 1, 1);
        d = Ext.ux.colorpick.ColorUtils.rgb2hex(c.r, c.g, c.b);
        a.getEl().applyStyles(e.gradientStyleTpl.apply({hex: d}))
    }
});
Ext.define("Ext.ux.colorpick.SliderHue", {
    extend: "Ext.ux.colorpick.Slider",
    alias: "widget.colorpickersliderhue",
    cls: Ext.baseCSSPrefix + "colorpicker-hue",
    afterRender: function () {
        var b = this, c = b.gradientUrl, a = b.el;
        b.callParent();
        if (!c) {
            c = a.getStyle("background-image");
            c = c.substring(4, c.length - 1);
            if (c.indexOf('"') === 0) {
                c = c.substring(1, c.length - 1)
            }
            Ext.ux.colorpick.SliderHue.prototype.gradientUrl = c
        }
        a.setStyle("background-image", "none");
        a = b.getDragContainer().layout.getElementTarget();
        a.createChild({tag: "img", cls: Ext.baseCSSPrefix + "colorpicker-hue-gradient", src: c})
    },
    setHue: function (c) {
        var e = this, b = e.getDragContainer(), a = e.getDragHandle(), g = b.getEl(), f = g.getHeight(), d, h;
        if (!a.dd || !a.dd.constrain) {
            return
        }
        if (typeof a.dd.dragEnded !== "undefined" && !a.dd.dragEnded) {
            return
        }
        h = f * (360 - c) / 360;
        d = a.getEl();
        d.setStyle({top: h + "px"})
    }
});
Ext.define("Ext.ux.colorpick.Selector", {
    extend: "Ext.container.Container",
    xtype: "colorselector",
    mixins: ["Ext.ux.colorpick.Selection"],
    controller: "colorpick-selectorcontroller",
    requires: ["Ext.layout.container.HBox", "Ext.form.field.Text", "Ext.form.field.Number", "Ext.ux.colorpick.ColorMap", "Ext.ux.colorpick.SelectorModel", "Ext.ux.colorpick.SelectorController", "Ext.ux.colorpick.ColorPreview", "Ext.ux.colorpick.Slider", "Ext.ux.colorpick.SliderAlpha", "Ext.ux.colorpick.SliderSaturation", "Ext.ux.colorpick.SliderValue", "Ext.ux.colorpick.SliderHue"],
    width: 580,
    height: 337,
    cls: Ext.baseCSSPrefix + "colorpicker",
    padding: 10,
    layout: {type: "hbox", align: "stretch"},
    defaultBindProperty: "value",
    twoWayBindable: ["value"],
    fieldWidth: 50,
    fieldPad: 5,
    showPreviousColor: false,
    showOkCancelButtons: false,
    listeners: {resize: "onResize"},
    constructor: function (b) {
        var c = this, a = Ext.Factory.viewModel("colorpick-selectormodel");
        c.childViewModel = a;
        c.items = [c.getMapAndHexRGBFields(a), c.getSliderAndHField(a), c.getSliderAndSField(a), c.getSliderAndVField(a), c.getSliderAndAField(a), c.getPreviewAndButtons(a, b)];
        c.callParent(arguments)
    },
    updateColor: function (a) {
        var b = this;
        b.mixins.colorselection.updateColor.call(b, a);
        b.childViewModel.set("selectedColor", a)
    },
    updatePreviousColor: function (a) {
        this.childViewModel.set("previousColor", a)
    },
    getMapAndHexRGBFields: function (a) {
        var c = this, d = {top: 0, right: c.fieldPad, bottom: 0, left: 0}, b = c.fieldWidth;
        return {
            xtype: "container",
            viewModel: a,
            cls: Ext.baseCSSPrefix + "colorpicker-escape-overflow",
            flex: 1,
            layout: {type: "vbox", align: "stretch"},
            margin: "0 10 0 0",
            items: [{
                xtype: "colorpickercolormap",
                reference: "colorMap",
                flex: 1,
                bind: {position: {bindTo: "{selectedColor}", deep: true}, hue: "{selectedColor.h}"},
                listeners: {handledrag: "onColorMapHandleDrag"}
            }, {
                xtype: "container",
                layout: "hbox",
                defaults: {
                    labelAlign: "top", labelSeparator: "", allowBlank: false, onChange: function () {
                        if (this.isValid()) {
                            Ext.form.field.Base.prototype.onChange.apply(this, arguments)
                        }
                    }
                },
                items: [{
                    xtype: "textfield",
                    fieldLabel: "HEX",
                    flex: 1,
                    bind: "{hex}",
                    margin: d,
                    readOnly: true
                }, {
                    xtype: "numberfield",
                    fieldLabel: "R",
                    bind: "{red}",
                    width: b,
                    hideTrigger: true,
                    maxValue: 255,
                    minValue: 0,
                    margin: d
                }, {
                    xtype: "numberfield",
                    fieldLabel: "G",
                    bind: "{green}",
                    width: b,
                    hideTrigger: true,
                    maxValue: 255,
                    minValue: 0,
                    margin: d
                }, {
                    xtype: "numberfield",
                    fieldLabel: "B",
                    bind: "{blue}",
                    width: b,
                    hideTrigger: true,
                    maxValue: 255,
                    minValue: 0,
                    margin: 0
                }]
            }]
        }
    },
    getSliderAndHField: function (a) {
        var b = this;
        return {
            xtype: "container",
            viewModel: a,
            cls: Ext.baseCSSPrefix + "colorpicker-escape-overflow",
            width: b.fieldWidth,
            layout: {type: "vbox", align: "stretch"},
            items: [{
                xtype: "colorpickersliderhue",
                reference: "hueSlider",
                flex: 1,
                bind: {hue: "{selectedColor.h}"},
                listeners: {handledrag: "onHueSliderHandleDrag"}
            }, {
                xtype: "numberfield",
                fieldLabel: "H",
                labelAlign: "top",
                width: b.fieldWidth,
                labelSeparator: "",
                bind: "{hue}",
                hideTrigger: true,
                maxValue: 360,
                minValue: 0,
                allowBlank: false,
                margin: 0
            }]
        }
    },
    getSliderAndSField: function (a) {
        var b = this;
        return {
            xtype: "container",
            viewModel: a,
            cls: Ext.baseCSSPrefix + "colorpicker-escape-overflow",
            width: b.fieldWidth,
            layout: {type: "vbox", align: "stretch"},
            margin: {right: b.fieldPad, left: b.fieldPad},
            items: [{
                xtype: "colorpickerslidersaturation",
                reference: "satSlider",
                flex: 1,
                bind: {saturation: "{saturation}", hue: "{selectedColor.h}"},
                listeners: {handledrag: "onSaturationSliderHandleDrag"}
            }, {
                xtype: "numberfield",
                fieldLabel: "S",
                labelAlign: "top",
                labelSeparator: "",
                bind: "{saturation}",
                hideTrigger: true,
                maxValue: 100,
                minValue: 0,
                allowBlank: false,
                margin: 0
            }]
        }
    },
    getSliderAndVField: function (a) {
        var b = this;
        return {
            xtype: "container",
            viewModel: a,
            cls: Ext.baseCSSPrefix + "colorpicker-escape-overflow",
            width: b.fieldWidth,
            layout: {type: "vbox", align: "stretch"},
            items: [{
                xtype: "colorpickerslidervalue",
                reference: "valueSlider",
                flex: 1,
                bind: {value: "{value}", hue: "{selectedColor.h}"},
                listeners: {handledrag: "onValueSliderHandleDrag"}
            }, {
                xtype: "numberfield",
                fieldLabel: "V",
                labelAlign: "top",
                labelSeparator: "",
                bind: "{value}",
                hideTrigger: true,
                maxValue: 100,
                minValue: 0,
                allowBlank: false,
                margin: 0
            }]
        }
    },
    getSliderAndAField: function (a) {
        var b = this;
        return {
            xtype: "container",
            viewModel: a,
            cls: Ext.baseCSSPrefix + "colorpicker-escape-overflow",
            width: b.fieldWidth,
            layout: {type: "vbox", align: "stretch"},
            margin: {left: b.fieldPad},
            items: [{
                xtype: "colorpickerslideralpha",
                reference: "alphaSlider",
                flex: 1,
                bind: {alpha: "{alpha}", color: {bindTo: "{selectedColor}", deep: true}},
                listeners: {handledrag: "onAlphaSliderHandleDrag"}
            }, {
                xtype: "numberfield",
                fieldLabel: "A",
                labelAlign: "top",
                labelSeparator: "",
                bind: "{alpha}",
                hideTrigger: true,
                maxValue: 100,
                minValue: 0,
                allowBlank: false,
                margin: 0
            }]
        }
    },
    getPreviewAndButtons: function (a, c) {
        var b = [{xtype: "colorpickercolorpreview", flex: 1, bind: {color: {bindTo: "{selectedColor}", deep: true}}}];
        if (c.showPreviousColor) {
            b.push({
                xtype: "colorpickercolorpreview",
                flex: 1,
                bind: {color: {bindTo: "{previousColor}", deep: true}},
                listeners: {click: "onPreviousColorSelected"}
            })
        }
        if (c.showOkCancelButtons) {
            b.push({xtype: "button", text: "OK", margin: "10 0 0 0", handler: "onOK"}, {
                xtype: "button",
                text: "Cancel",
                margin: "10 0 0 0",
                handler: "onCancel"
            })
        }
        return {
            xtype: "container",
            viewModel: a,
            width: 70,
            margin: "0 0 0 10",
            items: b,
            layout: {type: "vbox", align: "stretch"}
        }
    }
});
Ext.define("Ext.ux.colorpick.ButtonController", {
    extend: "Ext.app.ViewController",
    alias: "controller.colorpick-buttoncontroller",
    requires: ["Ext.window.Window", "Ext.layout.container.Fit", "Ext.ux.colorpick.Selector", "Ext.ux.colorpick.ColorUtils"],
    afterRender: function (a) {
        a.updateColor(a.getColor())
    },
    destroy: function () {
        var a = this.getView(), b = a.colorPickerWindow;
        if (b) {
            b.destroy();
            a.colorPickerWindow = a.colorPicker = null
        }
        this.callParent()
    },
    getPopup: function () {
        var c = this.getView(), b = c.colorPickerWindow, a;
        if (!b) {
            b = Ext.create(c.getPopup());
            c.colorPickerWindow = b;
            b.colorPicker = c.colorPicker = a = b.lookupReference("selector");
            a.setFormat(c.getFormat());
            a.on({ok: "onColorPickerOK", cancel: "onColorPickerCancel", scope: this})
        }
        return b
    },
    onClick: function () {
        var e = this, c = e.getView(), d = c.getColor(), b = e.getPopup(), a = b.colorPicker;
        a.setColor(d);
        a.setPreviousColor(d);
        b.showBy(c, "tl-br?")
    },
    onColorPickerOK: function (c) {
        var a = this.getView(), b = c.getColor(), d = a.colorPickerWindow;
        d.hide();
        a.setColor(b)
    },
    onColorPickerCancel: function () {
        var a = this.getView(), b = a.colorPickerWindow;
        b.hide()
    },
    syncColor: function (b) {
        var a = this.getView();
        Ext.ux.colorpick.ColorUtils.setBackground(a.filterEl, b)
    }
});
Ext.define("Ext.ux.colorpick.Button", {
    extend: "Ext.Component",
    xtype: "colorbutton",
    controller: "colorpick-buttoncontroller",
    mixins: ["Ext.ux.colorpick.Selection"],
    requires: ["Ext.ux.colorpick.ButtonController"],
    baseCls: Ext.baseCSSPrefix + "colorpicker-button",
    width: 20,
    height: 20,
    childEls: ["btnEl", "filterEl"],
    config: {
        popup: {
            lazy: true,
            $value: {
                xtype: "window",
                referenceHolder: true,
                minWidth: 540,
                minHeight: 200,
                layout: "fit",
                header: false,
                resizable: true,
                items: {
                    xtype: "colorselector",
                    reference: "selector",
                    showPreviousColor: true,
                    showOkCancelButtons: true
                }
            }
        }
    },
    defaultBindProperty: "value",
    twoWayBindable: "value",
    renderTpl: '<div id="{id}-filterEl" data-ref="filterEl" style="height:100%; width:100%; position: absolute;"></div><a id="{id}-btnEl" data-ref="btnEl" style="height:100%; width:100%; position: absolute;"></a>',
    listeners: {click: "onClick", element: "btnEl"},
    updateColor: function (a) {
        var b = this, c = b.colorPicker;
        b.mixins.colorselection.updateColor.call(b, a);
        Ext.ux.colorpick.ColorUtils.setBackground(b.filterEl, a);
        if (c) {
            c.setColor(a)
        }
    },
    updateFormat: function (b) {
        var a = this.colorPicker;
        if (a) {
            a.setFormat(b)
        }
    }
});
Ext.define("Ext.ux.colorpick.Field", {
    extend: "Ext.form.field.Picker",
    xtype: "colorfield",
    mixins: ["Ext.ux.colorpick.Selection"],
    requires: ["Ext.window.Window", "Ext.ux.colorpick.Selector", "Ext.ux.colorpick.ColorUtils", "Ext.layout.container.Fit"],
    editable: false,
    matchFieldWidth: false,
    beforeBodyEl: ['<div class="' + Ext.baseCSSPrefix + 'colorpicker-field-swatch"><div id="{id}-swatchEl" data-ref="swatchEl" class="' + Ext.baseCSSPrefix + 'colorpicker-field-swatch-inner"></div></div>'],
    cls: Ext.baseCSSPrefix + "colorpicker-field",
    childEls: ["swatchEl"],
    config: {
        popup: {
            lazy: true,
            $value: {
                xtype: "window",
                referenceHolder: true,
                minWidth: 540,
                minHeight: 200,
                layout: "fit",
                header: false,
                resizable: true,
                items: {
                    xtype: "colorselector",
                    reference: "selector",
                    showPreviousColor: true,
                    showOkCancelButtons: true
                }
            }
        }
    },
    afterRender: function () {
        this.callParent();
        this.updateValue(this.value)
    },
    createPicker: function () {
        var c = this, a = c.getPopup(), b;
        c.colorPickerWindow = a = Ext.create(a);
        c.colorPicker = b = a.lookupReference("selector");
        b.setFormat(c.getFormat());
        b.setColor(c.getColor());
        b.on({ok: "onColorPickerOK", cancel: "onColorPickerCancel", scope: c});
        return c.colorPickerWindow
    },
    onColorPickerOK: function (a) {
        this.setColor(a.getColor());
        this.collapse()
    },
    onColorPickerCancel: function () {
        this.collapse()
    },
    onExpand: function () {
        var a = this.getColor();
        this.colorPicker.setPreviousColor(a)
    },
    setValue: function (a) {
        var b = this, d = b.applyValue(a);
        b.callParent([d]);
        b.updateValue(d)
    },
    updateFormat: function (b) {
        var a = this.colorPicker;
        if (a) {
            a.setFormat(b)
        }
    },
    updateValue: function (a) {
        var b = this, d;
        if (!b.syncing) {
            b.syncing = true;
            b.setColor(a);
            b.syncing = false
        }
        d = b.getColor();
        Ext.ux.colorpick.ColorUtils.setBackground(b.swatchEl, d);
        if (b.colorPicker) {
            b.colorPicker.setColor(d)
        }
    }
});
Ext.define("Ext.ux.rating.Picker", {
    extend: "Ext.Widget",
    xtype: "rating",
    focusable: true,
    cachedConfig: {
        family: "monospace",
        glyphs: "☆★",
        minimum: 1,
        limit: 5,
        overStyle: null,
        rounding: 1,
        scale: "125%",
        selectedStyle: null,
        style: null,
        tooltip: null,
        trackOver: true,
        value: null,
        tooltipText: null,
        trackingValue: null
    },
    config: {animate: null},
    element: {
        cls: "u" + Ext.baseCSSPrefix + "rating-picker",
        reference: "element",
        children: [{
            reference: "innerEl",
            cls: "u" + Ext.baseCSSPrefix + "rating-picker-inner",
            listeners: {
                click: "onClick",
                mousemove: "onMouseMove",
                mouseenter: "onMouseEnter",
                mouseleave: "onMouseLeave"
            },
            children: [{
                reference: "valueEl",
                cls: "u" + Ext.baseCSSPrefix + "rating-picker-value"
            }, {reference: "trackerEl", cls: "u" + Ext.baseCSSPrefix + "rating-picker-tracker"}]
        }]
    },
    defaultBindProperty: "value",
    twoWayBindable: "value",
    overCls: "u" + Ext.baseCSSPrefix + "rating-picker-over",
    trackOverCls: "u" + Ext.baseCSSPrefix + "rating-picker-track-over",
    applyGlyphs: function (a) {
        if (typeof a === "string") {
            a = [a.charAt(0), a.charAt(1)]
        } else {
            if (typeof a[0] === "number") {
                a = [String.fromCharCode(a[0]), String.fromCharCode(a[1])]
            }
        }
        return a
    },
    applyOverStyle: function (a) {
        this.trackerEl.applyStyles(a)
    },
    applySelectedStyle: function (a) {
        this.valueEl.applyStyles(a)
    },
    applyStyle: function (a) {
        this.element.applyStyles(a)
    },
    applyTooltip: function (a) {
        if (a && typeof a !== "function") {
            if (!a.isTemplate) {
                a = new Ext.XTemplate(a)
            }
            a = a.apply.bind(a)
        }
        return a
    },
    applyTrackingValue: function (a) {
        return this.applyValue(a)
    },
    applyValue: function (c) {
        if (c !== null) {
            var b = this.getRounding(), a = this.getLimit(), d = this.getMinimum();
            c = Math.round(Math.round(c / b) * b * 1000) / 1000;
            c = (c < d) ? d : (c > a ? a : c)
        }
        return c
    },
    onClick: function (a) {
        var b = this.valueFromEvent(a);
        this.setValue(b)
    },
    onMouseEnter: function () {
        this.element.addCls(this.overCls)
    },
    onMouseLeave: function () {
        this.element.removeCls(this.overCls)
    },
    onMouseMove: function (a) {
        var b = this.valueFromEvent(a);
        this.setTrackingValue(b)
    },
    updateFamily: function (a) {
        this.element.setStyle("fontFamily", "'" + a + "'")
    },
    updateGlyphs: function () {
        this.refreshGlyphs()
    },
    updateLimit: function () {
        this.refreshGlyphs()
    },
    updateScale: function (a) {
        this.element.setStyle("fontSize", a)
    },
    updateTooltip: function () {
        this.refreshTooltip()
    },
    updateTooltipText: function (e) {
        var d = this.innerEl, a = Ext.tip && Ext.tip.QuickTipManager, b = a && a.tip, c;
        if (a) {
            d.dom.setAttribute("data-qtip", e);
            this.trackerEl.dom.setAttribute("data-qtip", e);
            c = b && b.activeTarget;
            c = c && c.el;
            if (c && d.contains(c)) {
                b.update(e)
            }
        }
    },
    updateTrackingValue: function (d) {
        var c = this, a = c.trackerEl, b = c.valueToPercent(d);
        a.setStyle("width", b);
        c.refreshTooltip()
    },
    updateTrackOver: function (a) {
        this.element[a ? "addCls" : "removeCls"](this.trackOverCls)
    },
    updateValue: function (h, c) {
        var f = this, b = f.getAnimate(), g = f.valueEl, e = f.valueToPercent(h), d, a;
        if (f.isConfiguring || !b) {
            g.setStyle("width", e)
        } else {
            g.stopAnimation();
            g.animate(Ext.merge({from: {width: f.valueToPercent(c)}, to: {width: e}}, b))
        }
        f.refreshTooltip();
        if (!f.isConfiguring) {
            if (f.hasListeners.change) {
                f.fireEvent("change", f, h, c)
            }
            d = f.getWidgetColumn && f.getWidgetColumn();
            a = d && f.getWidgetRecord && f.getWidgetRecord();
            if (a && d.dataIndex) {
                a.set(d.dataIndex, h)
            }
        }
    },
    afterCachedConfig: function () {
        this.refresh();
        return this.callParent(arguments)
    },
    initConfig: function (a) {
        this.isConfiguring = true;
        this.callParent([a]);
        this.refresh()
    },
    setConfig: function () {
        var a = this;
        a.isReconfiguring = true;
        a.callParent(arguments);
        a.isReconfiguring = false;
        a.refresh();
        return a
    },
    destroy: function () {
        var a = this, b = a.tip;
        if (b) {
            a.tip = Ext.destroy(b)
        }
        a.callParent()
    },
    privates: {
        getGlyphTextNode: function (b) {
            var a = b.lastChild;
            if (!a || a.nodeType !== 3) {
                a = b.ownerDocument.createTextNode("");
                b.appendChild(a)
            }
            return a
        }, getTooltipData: function () {
            var a = this;
            return {component: a, tracking: a.getTrackingValue(), trackOver: a.getTrackOver(), value: a.getValue()}
        }, refresh: function () {
            var a = this;
            if (a.invalidGlyphs) {
                a.refreshGlyphs(true)
            }
            if (a.invalidTooltip) {
                a.refreshTooltip(true)
            }
        }, refreshGlyphs: function (a) {
            var i = this, g = !a && (i.isConfiguring || i.isReconfiguring), c, j, f, h, e, b, d;
            if (!g) {
                c = i.getGlyphTextNode(i.innerEl.dom);
                d = i.getGlyphTextNode(i.valueEl.dom);
                b = i.getGlyphTextNode(i.trackerEl.dom);
                j = i.getGlyphs();
                f = i.getLimit();
                for (h = e = ""; f--;) {
                    e += j[0];
                    h += j[1]
                }
                c.nodeValue = e;
                d.nodeValue = h;
                b.nodeValue = h
            }
            i.invalidGlyphs = g
        }, refreshTooltip: function (b) {
            var c = this, a = !b && (c.isConfiguring || c.isReconfiguring), e = c.getTooltip(), d, f;
            if (!a) {
                e = c.getTooltip();
                if (e) {
                    d = c.getTooltipData();
                    f = e(d);
                    c.setTooltipText(f)
                }
            }
            c.invalidTooltip = a
        }, valueFromEvent: function (a) {
            var f = this, b = f.innerEl, e = a.getX(), j = f.getRounding(), d = b.getX(), g = e - d, h = b.getWidth(), c = f.getLimit(), i;
            if (f.getInherited().rtl) {
                g = h - g
            }
            i = g / h * c;
            i = Math.ceil(i / j) * j;
            return i
        }, valueToPercent: function (a) {
            a = (a / this.getLimit()) * 100;
            return a + "%"
        }
    }
});