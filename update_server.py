import os, time
import subprocess as SP

while True:
	# git pull to update
	pull = ["git", "pull"]
	SP.call(pull)
	
	# check if files have changed
	src_folder = "src/"
	mod_time = os.path.getmtime(src_folder)

	changed = False
	# if the src folder has changed in the last 10 seconds
	if ( time.time() - mod_time ) < 10: # 10 seconds should be sufficient for now
		changed = True
	
	if changed:
		print("Restarting server...")
		# Kill the server since it should already be running
		# pkill -9 node
		pkill_node = ["pkill", "-9", "node"]
		SP.call(pkill_node)

		# npm install
		npm_install = ["npm", "install"]
		SP.call(npm_install)

		# prisma deploy
		prisma_deploy = ["prisma", "deploy"]
		SP.call(prisma_deploy)

		# npm start
		npm_start = "nohup npm start &"
		os.system(npm_start)
		
		print("Server restarted.")

	# sleep before checking again
	time.sleep(10)
	# end
