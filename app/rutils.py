import subprocess;



class RUtil:


	def runScript(self,scriptFile):
		subprocess.call(['Rscript', scriptFile], shell=False)

