# read frequency list
fileFrequency = open("../Frequency/frequencyCut.txt")
frequencyList = fileFrequency.readlines()
fileFrequency.close()

for i in range(len(frequencyList)):
    frequencyList[i] = frequencyList[i].split(" ")[0]

# generate questions
def generateQuestions(name, n):

    # read pronunciation dictionary
    fileDictionary = open("../Dictionary/" + name + "-dictionary.txt", "r")
    lines = fileDictionary.readlines()
    fileDictionary.close()

    PhonemesDict = dict()
    for line in lines:

        lineSplit = line.rstrip().split("; ")
        word = lineSplit[0]
        phonemes = lineSplit[1].split(", ")
        phonemes = tuple(phonemes)

        if word not in PhonemesDict:
            PhonemesDict[word] = phonemes

    # select words for questions
    Questions = dict()
    fails = []

    for word in frequencyList:

        if word in PhonemesDict:

            phonemes = PhonemesDict[word]
            if phonemes in Questions:
                Questions[phonemes].append(word)
            else:
                Questions[phonemes] = [word]

        else:            
            fails.append(word)

        if len(Questions) >= n:
            break

    print("Fails", name, ":", len(fails))

    # add missing homophones
    for word, phonemes in PhonemesDict.items():
        if phonemes in Questions:
            if word not in Questions[phonemes]:
                Questions[phonemes].append(word)

    # write questions
    fileQuestions = open("../Questions/" + name + "-questions.txt", "w")

    for phonemes, words in Questions.items():
        for i in range(len(phonemes)):

            if i != 0:
                fileQuestions.write(" ")
            fileQuestions.write(phonemes[i])

        fileQuestions.write("; ")

        words.sort()
        for i in range(len(words)):

            if i != 0:
                fileQuestions.write(" ")
            fileQuestions.write(words[i])

        fileQuestions.write("\n")

    fileQuestions.close()

# generate questions
generateQuestions("en-uk", 5000)
generateQuestions("en-us", 5000)
