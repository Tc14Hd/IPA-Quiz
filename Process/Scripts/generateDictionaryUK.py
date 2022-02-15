fileRaw = open("../Raw/britfone.csv", "r")
lines = fileRaw.readlines()
fileRaw.close()

fileDictionary = open("../Dictionary/en-uk-dictionary.txt", "w")

for line in lines:

    lineSplit = line.rstrip().split(", ")
    word = lineSplit[0].lower()
    phonemesRaw = lineSplit[1].split(" ")

    pos = word.find("(") 
    if pos != -1:
        word = word[:pos]

    phonemes = []
    for phoneme in phonemesRaw:

        if phoneme[0] == "ˈ" or phoneme[0] == "ˌ":
            phonemes.append(phoneme[0])
            phoneme = phoneme[1:]

        if phoneme == "ɐ":
            phoneme = "ʌ"

        if phoneme == "tʃ":
            phoneme = "t͡ʃ"

        if phoneme == "dʒ":
            phoneme = "d͡ʒ"

        phonemes.append(phoneme)

    fileDictionary.write(word)
    fileDictionary.write("; ")

    for i in range(len(phonemes)):

        if i != 0:
            fileDictionary.write(" ")
        fileDictionary.write(phonemes[i])

    fileDictionary.write("\n")

fileDictionary.close()
