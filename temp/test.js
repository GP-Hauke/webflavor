correct: $(currentAnswer.find("answer")[j]).attr("correct"),
img: $(currentAnswer.find("answer")[j]).find("modelImgSrc").text(),
brand: $(currentAnswer.find("answer")[j]).find("brand").text(),
model: $(currentAnswer.find("answer")[j]).find("model").text(),
attributes: $(currentAnswer.find("answer")[j]).find("attributes").text(),
mpg: (parseInt($(currentAnswer.find("answer")[j]).find("mpgCity").text()) + parseInt($(currentAnswer.find("answer")[j]).find("mpgHighway").text()))/2,
rearLegRoom: $(currentAnswer.find("answer")[j]).find("rearLegRoom").text(),
cargoVol: $(currentAnswer.find("answer")[j]).find("cargoVol").text(),
basePrice: $(currentAnswer.find("answer")[j]).find("basePrice").text(),
horsePower: $(currentAnswer.find("answer")[j]).find("horsePower").text()
