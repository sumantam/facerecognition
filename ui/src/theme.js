import * as am5 from "@amcharts/amcharts5";
import theme_1_image from './images/themes/theme_1.jpg';
import theme_2_image from './images/themes/theme_2.jpg';
import theme_3_image from './images/themes/theme_3.jpg';
import theme_4_image from './images/themes/theme_4.jpg';
import theme_5_image from './images/themes/theme_5.jpg';
import theme_6_image from './images/themes/theme_6.jpg';
import theme_7_image from './images/themes/theme_7.jpg';
import theme_8_image from './images/themes/theme_8.jpg';


 const themes = [
    {
        "title": "Theme 1",
        "colors": {
            "redGradientColor": [am5.color(0xfd0000), am5.color(0xff9500)],
            "greenGradientColor": [am5.color(0xabfd00), am5.color(0x00ff3b)],
            "yellowGradientColor": [am5.color(0xfdcb00), am5.color(0xe4ff00)],
            "colorShades": ['#2B65BE', '#2b8cbe', '#4eb3d3', '#7bccc4', '#a8ddb5', '#ccebc5', '#E71036', '#14E2A1', '#2C2F30', '#27657a']
        },
        "fontFamily": "Times New Roman, Times, serif",
        "imageUrl": theme_1_image
    },
    {
        "title": "Theme 2",
        "colors": {
            "redGradientColor": [am5.color(0xf94144), am5.color(0xf3722c)],
            "greenGradientColor": [am5.color(0x9ef01a), am5.color(0xccff33)],
            "yellowGradientColor": [am5.color(0xffdd00), am5.color(0xffea00)],
            "colorShades": ['#012a4a', '#013a63', '#01497c', '#014f86', '#2a6f97', '#2c7da0', '#468faf', '#61a5c2', '#89c2d9', '#a9d6e5'],
        },
        "fontFamily": "Roboto, serif",
        "imageUrl": theme_2_image
    },
    {
        "title": "Theme 3",
        "colors": {
            "redGradientColor": [am5.color(0xd00000), am5.color(0xdc2f02)],
            "greenGradientColor": [am5.color(0x80ed99), am5.color(0x57cc99)],
            "yellowGradientColor": [am5.color(0xfaa307), am5.color(0xffba08)],
            "colorShades": ['#03071e', '#370617', '#6a040f', '#9d0208', '#d00000', '#dc2f02', '#e85d04', '#f48c06', '#faa307', '#ffba08'],
        },
        "fontFamily": "serif",
        "imageUrl": theme_3_image
    },
    {
        "title": "Theme 4",
        "colors": {
            "redGradientColor": [am5.color(0xba181b), am5.color(0xe5383b)],
            "greenGradientColor": [am5.color(0x70e000), am5.color(0x9ef01a)],
            "yellowGradientColor": [am5.color(0xffd100), am5.color(0xffee32)],
            "colorShades": ['#001219', '#005f73', '#0a9396', '#94d2bd', '#e9d8a6', '#ee9b00', '#ca6702', '#bb3e03', '#ae2012', '#9b2226'],
        },
        "fontFamily": "cursive",
        "imageUrl": theme_4_image
    },
    {
        "title": "Theme 5",
        "colors": {
            "redGradientColor": [am5.color(0xfd0000), am5.color(0xff9500)],
            "greenGradientColor": [am5.color(0xabfd00), am5.color(0x00ff3b)],
            "yellowGradientColor": [am5.color(0xfdcb00), am5.color(0xe4ff00)],
            "colorShades": ['#f94144', '#f3722c', '#f8961e', '#f9844a', '#f9c74f', '#90be6d', '#43aa8b', '#4d908e', '#577590', '#277da1'],
        },
        "fontFamily": "system-ui",
        "imageUrl": theme_5_image
    },
    {
        "title": "Theme 6",
        "colors": {
            "redGradientColor": [am5.color(0xf94144), am5.color(0xf3722c)],
            "greenGradientColor": [am5.color(0x9ef01a), am5.color(0xccff33)],
            "yellowGradientColor": [am5.color(0xffdd00), am5.color(0xffea00)],
            "colorShades": ['#54478c', '#2c699a', '#048ba8', '#0db39e', '#16db93', '#83e377', '#b9e769', '#efea5a', '#f1c453', '#f29e4c'],
        },
        "fontFamily": "Georgia, serif",
        "imageUrl": theme_6_image
    },
    {
        "title": "Theme 7",
        "colors": {
            "redGradientColor": [am5.color(0xd00000), am5.color(0xdc2f02)],
            "greenGradientColor": [am5.color(0x80ed99), am5.color(0x57cc99)],
            "yellowGradientColor": [am5.color(0xfaa307), am5.color(0xffba08)],
            "colorShades": ['#ea698b', '#d55d92', '#c05299', '#ac46a1', '#973aa8', '#822faf', '#6d23b6', '#6411ad', '#571089', '#47126b'],
        },
        "fontFamily": "Arial, Helvetica, sans-serif",
        "imageUrl": theme_7_image
    },
    {
        "title": "Theme 8",
        "colors": {
            "redGradientColor": [am5.color(0xba181b), am5.color(0xe5383b)],
            "greenGradientColor": [am5.color(0x70e000), am5.color(0x9ef01a)],
            "yellowGradientColor": [am5.color(0xffd100), am5.color(0xffee32)],
            "colorShades": ['#797d62', '#9b9b7a', '#baa587', '#d9ae94', '#f1dca7', '#ffcb69', '#e8ac65', '#d08c60', '#b58463', '#997b66'],
        },
        "fontFamily": "Roboto, monospace",
        "imageUrl": theme_8_image
    }
];

export default  themes;