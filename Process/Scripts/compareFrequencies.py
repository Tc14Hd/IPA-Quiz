file = open("../Raw/word-frequency1.txt", "r")
frequency1 = file.readlines()
file.close()

for i in range(len(frequency1)):
    frequency1[i] = frequency1[i].split(" ")[0]

file = open("../Raw/word-frequency2.txt", "r")
frequency2 = file.readlines()
file.close()

for i in range(len(frequency2)):
    frequency2[i] = frequency2[i].split("\t")[1]

n = 1000
S1 = set(frequency1[:n])
S2 = set(frequency2[:n])

D12 = S1.difference(S2)
D21 = S2.difference(S1)

for word in D12:
    print(word)

print("\n\n")

for word in D21:
    print(word)
