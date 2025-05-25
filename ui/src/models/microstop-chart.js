
const AdditionalMarkerData = function (target, x, y, colorCode) {
    this.target = target;
    this.xValue = x;
    this.yValue = y;
    this.colorCode = colorCode;
}

const ParetoModel = function (obj) {
    this.key = obj.name;
    this.value = obj.value;
}

const TrendModel = function (obj) {
    this.target = obj.title;
    this.dataPoints = obj.data.map(item => new PointForAPI(item));
}

const PointForAPI = function (obj) {
    this.label = obj.range;
    this.value = obj.value;
}

const TrendModelWithSum = function (reference, data) {
    this.target = reference;
    this.sum = getSum(data);
    this.dataPoints = data.map(item => new PointNew(item.range, item.value));
}

const getSum = (data) => {
    let sum = 0;
    data.forEach(p => sum += p["value"]);
    return sum;
}

const PointNew = function (name, value) {
    this.label = name;
    this.value = value;
}

export { AdditionalMarkerData, TrendModel, ParetoModel, TrendModelWithSum };