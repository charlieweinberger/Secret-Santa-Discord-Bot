let a = {
    'Charlie#5454': {
        "name": "charlie",
        "wishlist": ["one", "two", "three"]
    },
    'Adix#9283': {
        "name": "Adix",
        "wishlist": ["four", "five", "six"]
    },
    'Justin#2832': {
        "name": "Justin",
        "wishlist": ["seven", "eight", "nine"]
    },
    'Anton#0293': {
        "name": "Anton",
        "wishlist": ["ten", "eleven", "twelve"]
    }
}

let order = [5, 3, 6, 1]

for (let i = 0; i < order.length; i++) {
    console.log(i, order[i == 0 ? order.length - 1 : i - 1]);
}