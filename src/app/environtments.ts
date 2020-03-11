import { Intro } from './interface/intro'

export const globals = {
    serverPermit : "http://localhost:8080/api/permit",
    server: "http://localhost:8080/api",
    collections: "http://localhost:8080/api/img/collections/",
    origin: "http://localhost:4200"
}
export const featured:Set<string> = new Set(["best-sellers","new arrivals","all"]);
export const introLine2:Map<string,Map<string,Intro>> = new Map([
    ['women',new Map([
        ['sweaters',{
            heading: null,
            title: "The Oversized Alpaca Cardigan",
            content: "Lighter. Longer. Luxe-r",
            color: "white-text-intro",
            position: "right-intro",
            productPerColumn:"col-md-4"
        }],
        ['loafers',{
            heading: null,
            title: null,
            content: "The Modern Loafer is retiring.\n$90 while supplies last.",
            color: "white-text-intro",
            position: "left-intro",
            productPerColumn:"col-md-4"
        }],
        ['sweatshirts',{
            heading: null,
            title: null,
            content: "Sweatshirts",
            color: "black-text-intro",
            position: "right-intro",
            productPerColumn:"col-md-4"
        }],
        ["coats-&-jackets",{
            heading: null,
            title: null,
            content: "Coats & Jackets",
            color: "white-text-intro",
            position: "right-intro",
            productPerColumn:"col-md-4" 
        }],
        ['denim',{
            heading:["Skinny","Slim / Straight","Bootcut","Relaxed"],
            headingPerColumn: 1,
            title: null,
            content: "DENIM",
            color: "white-text-intro",
            position: "middle-intro",
            productPerColumn:"col-md-4"
        }],
        ['pants',{
            heading:null,
            title: null,
            content: "Because your butt should look good in cord too.",
            color: "white-text-intro",
            position: "right-intro",
            productPerColumn:"col-md-6"
        }],
        ['t-shirts',{
            heading:null,
            title: "Prima Micro Rib",
            content: "Trust us, it feels as good as it looks.",
            color: "black-text-intro",
            position: "right-intro",
            productPerColumn:"col-md-4"
        }],
        ['tops',{
            heading:null,
            title:null,
            content: "A cozy cotton button-up in our easieast, best-selling shape.",
            color: "black-text-intro",
            position: "right-intro",
            productPerColumn:"col-md-4"
        }],
        ["dresses-&-jumpsuits",{
            heading:null,
            title:null,
            content: "Dress & Jumpsuits",
            color: "black-text-intro",
            position: "left-intro",
            productPerColumn:"col-md-4"
        }],
        ["skirts-&-shorts",{
            heading:null,
            title:null,
            content: "Skirts & Shorts",
            color: "black-text-intro",
            position: "left-intro",
            productPerColumn:"col-md-4"
        }],
        ['lounge',{
            heading: null,
            title: null,
            content: "Lounge",
            color: "black-text-intro",
            position: "left-intro",
            productPerColumn: "col-md-6" 
        }],
        ["boots-&-booties",{
            heading:["Knit Boots","Heeled Boots","Chelsea Boots","Rain Boots"],
            headingPerColumn:3,
            title:null,
            content:null,
            color:null,
            position:null,
            productPerColumn:"col-md-4"
        }],
        ['flats',{
            heading:null,
            title: "The 40-Hour Flat",
            content: "When it comes to style and comfort, it's a professional.",
            color:"white-text-intro",
            position: "left-intro",
            productPerColumn: "col-md-4"
        }],
        ['heels',{
            heading: null,
            title: null,
            content: "Heels",
            color: "black-text-intro",
            position: "right-intro",
            productPerColumn: "col-md-4"
        }],
        ['sandals',{
            heading:null,
            title:null,
            content: "Sandals",
            color: "black-text-intro",
            position: "left-intro",
            productPerColumn: "col-md-4"
        }],
        ['handbags-&-wallets',{
            heading:null,
            title:null,
            content: "Handbags & Wallets",
            color: "black-text-intro",
            position:"left-intro",
            productPerColumn: "col-md-4"
        }],
        ['backpacks-&-bags',{
            heading: null,
            title: null,
            content: "Backpacks & Bags",
            color: "black-text-intro",
            position:"left-intro",
            productPerColumn: "col-md-4"
        }],
        ['scarves-&-hats',{
            heading:null,
            title:null,
            content: "Scarves & Hats",
            color: "white-text-intro",
            position: "right-intro",
            productPerColumn: "col-md-4"
        }],
        ['best-sellers',{
            heading:null,
            title: "Best-Sellers",
            content:"Our most-loved styles live up to their reviews",
            color: "black-text-intro",
            position:"right-intro",
            productPerColumn:"col-md-4"
        }],
        ['all',{
            heading:["Flats","T-Shirts","Tops"],
            headingPerColumn:3,
            title:null,
            content:null,
            color:null,
            position:null,
            productPerColumn:"col-md-4"
        }]
    ])]
])
